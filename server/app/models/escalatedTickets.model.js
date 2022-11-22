module.exports = (sequelize, Sequelize) => {
    const EscalatedTickets = sequelize.define("escalatedtickets", {
        nextLevelEmail: {
            type: Sequelize.STRING,
        },
        assigneeEmail: {
            type: Sequelize.STRING,
        },
        ticketId: {
            type: Sequelize.INTEGER,
        },
        escalatedLevel: {
            type: Sequelize.STRING,
        },
        activeEscalationLevel: {
            type: Sequelize.INTEGER,
        },

    });

    return EscalatedTickets;
};
