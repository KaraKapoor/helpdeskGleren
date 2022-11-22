module.exports = (sequelize, Sequelize) => {
    const TicketReplies = sequelize.define("ticketreplies", {
        repliedby: {
            type: Sequelize.STRING,
        },
        recepients: {
            type: Sequelize.STRING,
        },
        message: {
            type: Sequelize.STRING(800),
        },
        s3FilesUrl: {
            type: Sequelize.JSON
        },
        textMessage: {
            type: Sequelize.STRING
        },
        messageDateTime: {
            type: Sequelize.DATE
        },
        isInternalNotes:{
            type:Sequelize.BOOLEAN
        },
        isTicketActivityThread:{
            type:Sequelize.BOOLEAN
        },
        usedInCannedFilters:{
            type:Sequelize.BOOLEAN
        }
    });

    return TicketReplies;
};
