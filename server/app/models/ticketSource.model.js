module.exports = (sequelize, Sequelize) => {
  const TicketSource = sequelize.define("ticketsources", {
    sourceName: {
      type: Sequelize.STRING,
    },
  });

  return TicketSource;
};
