module.exports = (sequelize, Sequelize) => {
    const TicketHistory = sequelize.define("ticket_history", {
      plain_text: {
        type: Sequelize.STRING(800)
      },
      ticket_id: {
        type: Sequelize.INTEGER
      }
    });
  
    return TicketHistory;
  };
  