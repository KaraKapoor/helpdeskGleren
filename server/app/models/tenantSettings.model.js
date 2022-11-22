module.exports = (sequelize, Sequelize) => {
    const TenantSettings = sequelize.define("core_tenant_settings", {
        tenantName:{
            type: Sequelize.STRING
        },
        isLarkAuthRequired: {
            type: Sequelize.Sequelize.BOOLEAN,
        },
        sendLarkAlerts:{
            type: Sequelize.Sequelize.BOOLEAN,
        },
        tenantLogo:{
            type: Sequelize.Sequelize.STRING,
        },
        smtp_host: {
            type: Sequelize.Sequelize.STRING,
        },
        smtp_port: {
            type: Sequelize.Sequelize.STRING,
        },
        smtp_user: {
            type: Sequelize.Sequelize.STRING,
        },
        smtp_password: {
            type: Sequelize.Sequelize.STRING,
        },
        smtp_email: {
            type: Sequelize.Sequelize.STRING,
        },
        is_smtp_enabled: {
            type: Sequelize.Sequelize.BOOLEAN,
        },
        is_school_esc_enabled: {
            type: Sequelize.Sequelize.BOOLEAN,
        },
        is_college_esc_enabled: {
            type: Sequelize.Sequelize.BOOLEAN,
        },
        is_administrative_esc_enabled: {
            type: Sequelize.Sequelize.BOOLEAN,
        },
        is_users_enabled: {
            type: Sequelize.Sequelize.BOOLEAN,
        }
    });

    return TenantSettings;
};
