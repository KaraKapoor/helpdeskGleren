const randomize = require('randomatic');
const db = require("../models");
const user = db.user;
const bcrypt = require("bcryptjs");
const { now } = require('moment');
const emailTemplates = require("../emailTemplates/emailTemplate");
const emailAPIService = require("./emailAPIService");
const tenantAPIService = require("./tenantAPIService");
const Op = db.Sequelize.Op;
const generalMethodService = require("../Services/generalMethodAPIService");
const { v4: uuidv4 } = require('uuid');
const errorConstants = require('../constants/errorConstants');
const fileAPIService = require("./fileAPIService");
const { uploads } = require('../models');
exports.getByEmail = async (email) => {
    let response = null;
    response = await user.findOne({ where: { email: email } });
    return response;
}
exports.createUser = async (email, password, isEmailVerified, firstName, lastName, mobile, designation, role, tenantid) => {

    let response = null;
    const obj = {
        email: email,
        password: password,
        is_email_verified: isEmailVerified,
        first_name: firstName,
        last_name: lastName,
        mobile: mobile,
        designation: designation,
        role: role,
        is_active: true,
        last_login_dt: now(),
        tenant_id: tenantid
    }
    await user.create(obj);
    response = await this.getByEmail(email);
    return response;
}
exports.createUpdateUser = async (email, firstName, lastName, mobile, designation, role, active, id, tenantId,departmentId) => {
    let response = null;
    const obj = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: role,
        mobile: mobile,
        designation: designation,
        is_active: active,
        tenant_id: tenantId,
        department_id: departmentId
    }

    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id) !== null) {
        obj.id = id;
        await user.update(obj, { where: { id: id } });
    } else {
        const tenantSettings = await tenantAPIService.getTenantInfo(tenantId);
        const userCount = await this.getCountOfUsersForTenant(tenantId);
        if (userCount !== null && userCount >= tenantSettings?.max_user) {
            let errorMessage = errorConstants.MAX_USER_ERROR;
            errorMessage = errorMessage.replace('{userCount}', tenantSettings.max_user)
            response = {
                status: false,
                error: errorMessage,
            }
            return response;
        }
        const resetPasswordId = uuidv4();
        const resetLink = process.env.BASE_URL + 'session/reset-password' + `/${resetPasswordId}`;
        obj.reset_password_id = resetPasswordId;
        await user.create(obj);
        let registerEmailTemplate = emailTemplates.NEW_USER_REGISTER_EMAIL_TEMPLATE;
        registerEmailTemplate = registerEmailTemplate.replace('{firstName}', firstName);
        registerEmailTemplate = registerEmailTemplate.replace('{passwordResetLink}', resetLink);

        await emailAPIService.sendEmail(email, emailTemplates.NEW_USER_SUBJECT, null, null, null, registerEmailTemplate);
    }

    const createdUser = await this.getByEmail(email);
    response = {
        status: true,
        data: createdUser
    }

    return response
}
exports.getUserById = async (id) => {
    return user.findOne(({ where: { id: id } }));
}
exports.updateUser = async (id, updateObj, tenantid) => {
    await user.update(updateObj, { where: { [Op.and]: [{ id: id }, { tenant_id: tenantid }] } });
    return this.getUserById(id);
}
exports.getUserByResetTokenId = async (resetTokenId) => {
    return user.findOne(({ where: { reset_password_id: resetTokenId } }));
}
exports.getAllUsersWithPagination = async (page, size, tenantid) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(page, size);
    await user.findAndCountAll({ limit, offset, where: { tenant_id: tenantid } })
        .then(async (data) => {
            const res = await generalMethodService.getPagingData(data, page, limit);
            response = res;
        })
    return response;
}
exports.getUserByIdWithTenant = async (id, tenantId) => {
    return user.findOne(({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } }));
}
exports.getCountOfUsersForTenant = async (tenantId) => {
    return user.count({ where: { tenant_id: tenantId } });
}

exports.getProfileURL = async(userDetails, tenantId)=>{
    let url = null;
    if(userDetails.photo_id === null){
        return url;
    }else{
        const uploadDetails = await uploads.findOne({where:{id:userDetails.photo_id}});
         url = await fileAPIService.getSignedUrl(uploadDetails.key);
         return url;
    }
}