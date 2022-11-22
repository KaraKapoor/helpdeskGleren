const db = require("../models");
const Op = db.Sequelize.Op;
const constants = require("../constants/constants");
const NspiraUserSettings = db.nspiraUserSettings;


exports.getUserSettingsByType = async (req, res) => {
    const settingType = req.body.settingType;
    const userId = req.body.userId;

    if (settingType === null || settingType === undefined || userId === null || userId === undefined) {
        return res.status(200).send({
            message: "Following mandatory parameters not passed: settingType,userId",
            success: false
        });
    }
    await NspiraUserSettings.findAll({ where: { [Op.and]: [{ settingType: settingType }, { userId: userId }] } })
        .then((data) => {
            return res.status(200).send({
                data: data,
                success: true
            })
        })
        .catch((err) => {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving.",
            });
        });
};

exports.saveUserSettings = async (req, res) => {
    for (let i of req.body) {
        let settingValue = null;
        let isSettingValueNull=false;
        if (i.settingValue === '' || i.settingValue === "undefined" || i.settingValue === undefined || i.settingValue===null) {
            settingValue = null;
            isSettingValueNull=true;
        } else {
            settingValue = i.settingValue
        }
        const existingSettingsResp = await NspiraUserSettings.findOne({ where: { [Op.and]: [{ userId: i.userId }, { settingType: i.settingType }, { settingName: i.settingName }] } });
        if (existingSettingsResp != null) {
            /**Update Setting Case */
            const settingObj = {
                userId: i.userId,
                settingType: i.settingType,
                settingValue: settingValue,
                settingName: i.settingName,
            }
            await NspiraUserSettings.update(settingObj, { where: { id: existingSettingsResp.dataValues.id } }).then(async (resp) => {
                if(isSettingValueNull){
                    await NspiraUserSettings.destroy({where:{id:existingSettingsResp.dataValues.id}});
                }
            }).catch((err) => {
                console.log(err);
                return res.status(500).send({
                    message: err.message || "Some error occurred while retrieving.",
                });
            })
        } else {
            /**New Setting Save Case */
            if(isSettingValueNull){
                continue;//Don't save null in DB.
            }
            const settingObj = {
                userId: i.userId,
                settingType: i.settingType,
                settingValue: settingValue,
                settingName: i.settingName,
            }
            await NspiraUserSettings.create(settingObj).then(async (resp) => {

            }).catch((err) => {
                console.log(err);
                return res.status(500).send({
                    message: err.message || "Some error occurred while retrieving.",
                });
            })
        }
    }
    return res.status(200).send({
        success: true
    })



}

exports.clearUserSettings = async (req, res) => {
    const settingType = req.body.settingType;
    const userId = req.body.userId;

    if (settingType === null || settingType === undefined || userId === null || userId === undefined) {
        return res.status(200).send({
            message: "Following mandatory parameters not passed: settingType,userId",
            success: false
        });
    }

    await NspiraUserSettings.destroy({ where: { [Op.and]: [{ settingType: settingType }, { userId: userId }] } })
        .then(async (resp) => {
            return res.status(200).send({
                success: true
            });
        }).catch((err) => {
            return res.status(200).send({
                message: err.message || "Some error occurred while retrieving.",
                success: false
            });
        })
}