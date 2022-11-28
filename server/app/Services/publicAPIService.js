const errorConstants = require("../constants/errorConstants");
const emailTemplates = require("../emailTemplates/emailTemplate");
const coreSettingsService = require("./coreSettingAPIService");
const emailAPIService = require("./emailAPIService");
const generalMethodService = require("./generalMethodAPIService");
const emailVerifyService = require("./emailVerifyAPIService");
const userAPIService = require("./userAPIService");
const tenantAPIService = require("./tenantAPIService");
const { htmlToText } = require('html-to-text');
const apiConstants = require("../constants/apiConstants");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

exports.sendOTPEmail = async (email) => {
    let otpTemplate = emailTemplates.EMAIL_OTP_TEMPLATE;
    const otp = await emailVerifyService.generateEmailOTP(email);
    otpTemplate = otpTemplate.replace('{otp}', otp);


    await emailAPIService.sendEmail(email, emailTemplates.EMAIL_OTP_SUBJECT, null, null, null, otpTemplate);
}

exports.verifyOTP = async (email, otp) => {
    let existingVerified = await emailVerifyService.getByEmail(email);
    let response = null;
    if (existingVerified && existingVerified?.is_verified) {
        response = {
            status: true,
            message: apiConstants.EMAIL_VERIFIED
        }
    } else {
        const record = await emailVerifyService.getNotExpiredRecord(email);
        if (record && record.email) {
            if (bcrypt.compareSync(otp + '', record.otp_hash)) {
                const diff = await generalMethodService.getDifferenceInMinutes(new Date(), record.createdAt);
                if (diff < 5) {
                    await emailVerifyService.updateEmailVerify({ is_verified: true }, record.id);
                    response = {
                        status: true,
                        message: apiConstants.EMAIL_VERIFIED
                    }
                } else {
                    response = {
                        status: false,
                        error: apiConstants.EMAIL_OTP_EXPIRED
                    }
                }
            } else {
                response = {
                    status: false,
                    error: apiConstants.INVALID_OTP
                }
            }
        }
    }
    return response;
}

exports.login = async (email, password) => {
    let response = null;
    const user = await userAPIService.getByEmail(email);
    if (user && user.id) {
        if (user.is_active === false) {
            response = {
                status: false,
                error: errorConstants.INACTIVE_ACCOUNT_ERROR
            }
            return response;
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const JWTtoken = await jwt.sign(
                { user_id: user.id, email },
                process.env.JWT_TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            await userAPIService.updateUser(user.id, { last_login_dt: new Date() }, user.tenant_id)
            response = {
                status: true,
                data: {
                    token: JWTtoken,
                    user: user.dataValues
                }
            }
        } else {
            response = {
                status: false,
                error: errorConstants.INCORRECT_USERNAME_PASSWORD
            }
        }
    } else {
        response = {
            status: false,
            error: errorConstants.INCORRECT_USERNAME_PASSWORD
        }
    }
    return response;
}

exports.registerTenant = async (email, tenant_name, password, firstName, lastName, mobile, designation, role) => {
    let response = null;
    const existingUser = await userAPIService.getByEmail(email);
    if (existingUser && existingUser.email) {
        response = {
            status: false,
            error: errorConstants.USER_ALREADY_EXISTS
        }
    } else {
        const emailVerified = await emailVerifyService.getByEmail(email);
        if (emailVerified && emailVerified.is_verified) {
            const exisitingTenant = await tenantAPIService.findTenantByName(tenant_name);
            if (exisitingTenant && exisitingTenant.name) {
                response = {
                    status: false,
                    error: errorConstants.TENANT_SAME_NAME_ERROR
                }
            } else {
                const tenant = await tenantAPIService.createTenant(tenant_name);
                if (tenant && tenant.id) {
                    const encryptedPassword = await bcrypt.hash(password, 10);
                    const user = await userAPIService.createUser(email, encryptedPassword, emailVerified.is_verified, firstName, lastName, mobile, designation, role, tenant.id);
                    if (user && user.id) {
                        response = {
                            status: true,
                            message: apiConstants.CREATED_SUCCESSFULLY
                        }
                    }
                }
            }
        } else {
            response = {
                status: false,
                error: errorConstants.EMAIL_NOT_VERIFIED
            }
        }
    }
    return response;
}

exports.forgetPasswordEmail = async (email) => {
    let forgetEmailTemplate = emailTemplates.FORGET_PASSWORD_EMAIL_TEMPLATE;
    const userDetails = await userAPIService.getByEmail(email);
    const resetPasswordId = uuidv4();
    const resetLink = process.env.BASE_URL + 'session/reset-password' + `/${resetPasswordId}`;
    forgetEmailTemplate = forgetEmailTemplate.replace('{firstName}', userDetails.first_name);
    forgetEmailTemplate = forgetEmailTemplate.replace('{passwordResetLink}', resetLink);


    await emailAPIService.sendEmail(email, emailTemplates.FORGET_PASSWORD_SUBJECT, null, null, null, forgetEmailTemplate);
    await userAPIService.updateUser(userDetails.id, { reset_password_id: resetPasswordId }, userDetails.tenant_id);
}
exports.changePassword = async (resetPasswordToken, password) => {
    let response = null;
    const userDetails = await userAPIService.getUserByResetTokenId(resetPasswordToken);
    if (userDetails === null) {
        response = {
            status: false,
            error: errorConstants.INVALID_RESET_PASSWORD_LINK_ERROR
        }
    } else {
        const userObj = {
            updatedAt: new Date(),
            password: await bcrypt.hash(password, 10),
            reset_password_id: null,
            is_email_verified: true
        }
        await userAPIService.updateUser(userDetails.id, userObj, userDetails.tenant_id);
        response = {
            status: true
        }
    }
    return response;
}