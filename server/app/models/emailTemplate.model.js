module.exports = (sequelize, Sequelize) => {
    const EmailTemplate = sequelize.define("emailtemplates", {
        templateName: {
            type: Sequelize.STRING,
        },
        subject: {
            type: Sequelize.STRING,
        },
        emailBody: {
            type: Sequelize.STRING(1800),
        },
    });

    return EmailTemplate;
};
