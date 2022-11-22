module.exports = (sequelize, Sequelize) => {
  const Department = sequelize.define("departments", {
    departmentName: {
      type: Sequelize.STRING,
    },
  });

  return Department;
};
