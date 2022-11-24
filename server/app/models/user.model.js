module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        is_email_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        mobile: {
            type: Sequelize.STRING
        },
        designation: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
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

    return User;
};
