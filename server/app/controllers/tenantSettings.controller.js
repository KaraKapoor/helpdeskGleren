const db = require("../models");
const Op = db.Sequelize.Op;
const constants = require("../constants/constants");
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const TenantCoreSettings = db.tenantCoreSettings;

exports.saveUpdate = async (req, res) => {

    try {
        console.log("*************************Save/Update Tenant Core Settings API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        var tenantId = null;
        var isNew = true;
        const resp = await this.getSettingsByTenantName(req.body.tenantName);
        if ((req.body.id && req.body.id !== null && req.body.id !== undefined) || (resp!==null && resp.dataValues.id)) {
            isNew = false;
            tenantId = req.body.id || resp.dataValues.id;
        }

        //New Creation Flow
        if (isNew) {

            //Insert entry in Settings Table.
            const settingsObj = {
                tenantName: req.body.tenantName,
                isLarkAuthRequired: req.body.isLarkAuthRequired,
                sendLarkAlerts: req.body.sendLarkAlerts,
                smtp_host: req.body.smtp_host,
                smtp_port: req.body.smtp_port,
                smtp_user: req.body.smtp_user,
                smtp_password: req.body.smtp_password,
                smtp_email: req.body.smtp_email,
            }
            const settingsResponse = await TenantCoreSettings.create(settingsObj).then((resp) => {
                res.status(200).send({
                    success: true,
                    data: resp,
                });
            })
        }

        //Update Flow
        if (!isNew) {

            //Update entry in Settings Table.
            const settingsObj = {
                tenantName: req.body.tenantName,
                isLarkAuthRequired: req.body.isLarkAuthRequired,
                sendLarkAlerts: req.body.sendLarkAlerts,
                smtp_host: req.body.smtp_host,
                smtp_port: req.body.smtp_port,
                smtp_user: req.body.smtp_user,
                smtp_password: req.body.smtp_password,
                smtp_email: req.body.smtp_email,
            }
            const id = tenantId;
            var settingsResponse = await TenantCoreSettings.update(settingsObj, { where: { id: id } });
            settingsResponse = await TenantCoreSettings.findOne(req.body.id);
            res.status(200).send({
                success: true,
                data: settingsResponse
            });
        }
        console.log("*************************Save/Update Tenant Core Settings API Completed************************");
    } catch (err) {
        console.log("*************************Save/Update Tenant Core Settings API Completed with Errors************************" + err);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}

exports.findByTenantName = async (req, res) => {
    try {
        console.log("*************************Find Settings API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const resp = await this.getSettingsByTenantName(req.body.tenantName);
        res.status(200).send({
            success: true,
            data: resp,
        });
        console.log("*************************Find Settings API Completed************************");
    } catch (exception) {
        console.log("*************************Find Settings API Completed with Errors************************" + exception);
        res.status(500).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }

};

exports.getSettingsByTenantName = async (tenantName) => {
    let response;
    await TenantCoreSettings.findOne({ where: { tenantName: process.env.TENANT_NAME || tenantName } })
        .then((data) => {
            response = data;
        })
        .catch((err) => {
            console.log(err);
        });
    return response;
}