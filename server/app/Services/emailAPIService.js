const coreSettingsService = require("./coreSettingAPIService");
const generalMethodService = require("./generalMethodAPIService");
const apiConstants = require("../constants/apiConstants");
const coreSettingConstants = require("../constants/coreSettingsConstants");
const nodemailer = require('nodemailer');
exports.generateEmailTransporter = async () => {
    let coreSettings = await coreSettingsService.getAllCoreSettings();
    let host, port, user, password, fromEmailAddress, transporter = null;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(coreSettings) !== null) {
        await coreSettings.map((i) => {
            if (i.setting_name === coreSettingConstants.SMTP_HOST) {
                host = i.setting_value;
            } else if (i.setting_name === coreSettingConstants.SMTP_PORT) {
                port = i.setting_value;

            } else if (i.setting_name === coreSettingConstants.SMTP_USER) {
                user = i.setting_value;
            } else if (i.setting_name === coreSettingConstants.SMTP_PASSWORD) {
                password = i.setting_value;
            } else if (i.setting_name === coreSettingConstants.SMTP_FROM_EMAIL_ADDRESS) {
                fromEmailAddress = i.setting_value;
            }
        })
        transporter = await nodemailer.createTransport({
            host: host,
            port: port,
            auth: {
                user: user,
                pass: password
            }
        });

    }

    return transporter;
}

exports.sendEmail = async (toEmailAddress, subject, cc, bcc, body, html) => {
    const transporter = await this.generateEmailTransporter();
    const fromEmailSettings = await coreSettingsService.getSettingByName(coreSettingConstants.SMTP_FROM_EMAIL_ADDRESS);
    var mailOptions = {
        from: fromEmailSettings.setting_value,
        to: toEmailAddress,
        cc: cc,
        bcc: bcc,
        subject: await generalMethodService.getEmailSubjectPrefix() + subject,
        text: body,
        html: html
    };
    try {
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Error in sending email" + error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (exception) {
        throw new Error("Exception in Send Email");
    }

}