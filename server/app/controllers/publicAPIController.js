const errorConstants = require("../constants/errorConstants");
const coreSettingsService = require("../Services/coreSettingAPIService");
const generalMethodService = require("../Services/generalMethodAPIService");
const publicAPIService = require("../Services/publicAPIService");

exports.sendOTPEmail = async (req, res) => {
    const input = req.body;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.email) == null) {

        return res.status(200).send({
            error: errorConstants.EMAIL_MANDATORY_ERROR,
            status: false
        });
    }

    try {
        await publicAPIService.sendOTPEmail(input.email);
        return res.status(200).send({
            status: true
        })
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }

};

exports.verifyOTP = async (req, res) => {
    const input = req.body;
    if (generalMethodService.do_Null_Undefined_EmptyArray_Check(input.otp) == null) {

        return res.status(200).send({
            error: errorConstants.OTP_MANDATORY_ERROR,
            status: false
        });
    }
    if (generalMethodService.do_Null_Undefined_EmptyArray_Check(input.email) == null) {

        return res.status(200).send({
            error: errorConstants.EMAIL_MANDATORY_ERROR,
            status: false
        });
    }

    try {
        const response = await publicAPIService.verifyOTP(input.email, input.otp);
        return res.status(200).send(response);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.login = async (req, res) => {
    const input = req.body;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.email) == null) {

        return res.status(200).send({
            error: errorConstants.EMAIL_MANDATORY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.password) == null) {

        return res.status(200).send({
            error: errorConstants.PASSWORD_MANDATORY_ERROR,
            status: false
        });
    }

    try {
        const response = await publicAPIService.login(input.email, input.password);
        return res.status(200).send(response);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.registerTenant = async (req, res) => {
    const input = req.body;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.email) == null) {

        return res.status(200).send({
            error: errorConstants.EMAIL_MANDATORY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.tenantName) == null) {

        return res.status(200).send({
            error: errorConstants.TENANT_NAME_MANDATORY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.password) == null) {

        return res.status(200).send({
            error: errorConstants.PASSWORD_MANDATORY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.firstName) == null) {

        return res.status(200).send({
            error: errorConstants.FIRST_NAME_MANDATORY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.lastName) == null) {

        return res.status(200).send({
            error: errorConstants.LAST_NAME_MANDATORY_ERROR,
            status: false
        });
    }

    try {
        const response = await publicAPIService.registerTenant(input.email, input.tenantName, input.password, input.firstName, input.lastName, input.mobile, input.designation, "admin");
        return res.status(200).send(response);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.forgetPasswordEmail = async (req, res) => {
    const input = req.body;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.email) == null) {

        return res.status(200).send({
            error: errorConstants.EMAIL_MANDATORY_ERROR,
            status: false
        });
    }
    try {
        await publicAPIService.forgetPasswordEmail(input.email);
        return res.status(200).send({
            status: true
        })
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}