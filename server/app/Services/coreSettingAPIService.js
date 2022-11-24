const db = require("../models");
const coreSetting = db.coreSetting;
exports.getAllCoreSettings = async () => {

    let response = []
    await coreSetting.findAll().then(async (resp) => {
        response = resp;
    })
    return response;
};

exports.getSettingByName = async (settingName) => {
    let response = null;

    await coreSetting.findOne({ where: { setting_name: settingName } }).then(async (resp) => {
        response = resp;
    })
    return response;
}