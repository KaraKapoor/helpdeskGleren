module.exports = (sequelize, Sequelize) => {
    const CoreSetting = sequelize.define("cor_setting", {
      setting_name: {
        type: Sequelize.STRING,
      },
      setting_value: {
        type: Sequelize.STRING,
      },
    });
  
    return CoreSetting;
  };
  