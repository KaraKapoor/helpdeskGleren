module.exports = (sequelize, Sequelize) => {
    const EmailVerify = sequelize.define("email_verify", {
        email: {
            type: Sequelize.STRING,
        },
        otp_hash: {
            type: Sequelize.STRING,
        },
        is_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        is_expired: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return EmailVerify;
};
