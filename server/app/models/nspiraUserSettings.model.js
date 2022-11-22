module.exports = (sequelize, Sequelize) => {
    const NspiraUserSettings = sequelize.define("nspira_userSettings", {
        settingType: {
            type: Sequelize.STRING,
        },
        settingName: {
            type: Sequelize.STRING,
        },
        settingValue: {
            type: Sequelize.JSON,
        },
    });
    return NspiraUserSettings;
  };
  