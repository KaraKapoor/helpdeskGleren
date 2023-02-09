module.exports = (sequelize, Sequelize) => {
    const TenantSettings = sequelize.define("tenant_settings", {
        setting_name: {
            type: Sequelize.STRING,
        },
        setting_value: {
            type: Sequelize.STRING,
        },
        tenant_id: {
            type: Sequelize.INTEGER
        }
    });

    return TenantSettings;
};
