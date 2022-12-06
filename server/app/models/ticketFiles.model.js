module.exports = (sequelize, Sequelize) => {
    const TicketFiles = sequelize.define("ticket_files", {
        ticket_id: {
            type: Sequelize.INTEGER
        },
        upload_id: {
            type: Sequelize.INTEGER
        }
    });

    return TicketFiles;
};
