module.exports = (sequelize, Sequelize) => {
    const Holidays = sequelize.define("holidays", {
      holiday_name: {
        type: Sequelize.STRING(255),
      },
      holiday_date: {
        type: Sequelize.DATE,
      },
    });
  
    return Holidays;
  };