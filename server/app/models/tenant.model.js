module.exports = (sequelize, Sequelize) => {
    const Tenant = sequelize.define("tenant", {
        name: {
            type: Sequelize.STRING,
        },
        max_user: {
            type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        last_login_dt: {
            type: Sequelize.DATE,
            defaultValue: null
        }
    });

    return Tenant;
};
