module.exports = (sequelize, Sequelize) => {
    const TicketHistory = sequelize.define("ticket_history", {
      plain_text: {
        type: Sequelize.TEXT('medium')
      },
      ticket_id: {
        type: Sequelize.INTEGER
      }
    });
  
    return TicketHistory;
  };
  