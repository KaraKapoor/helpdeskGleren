module.exports = (sequelize, Sequelize) => {
    const EmailJobs = sequelize.define("emailjobs", {
        ticketId: {
            type: Sequelize.INTEGER,
        },
        email: {
            type: Sequelize.STRING,
        },
        isEmailSend: {
            type: Sequelize.BOOLEAN,
        },
        escalationLevel: {
            type: Sequelize.STRING
        }

    });
    return EmailJobs;
};
