module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    email: {
      type: Sequelize.STRING,
    },
    fullName: {
      type: Sequelize.STRING,
    },
    openId: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.STRING,
    },
    officeType: {
      type: Sequelize.STRING,
    },
    designation: {
      type: Sequelize.STRING,
    },
    helpdeskRole: {
      type: Sequelize.STRING,
    },
    isAgent: {
      type: Sequelize.STRING
    },
    branch: {
      type: Sequelize.STRING
    },
    openDepartmentId: {
      type: Sequelize.STRING
    },
    employeeId:{
      type:Sequelize.INTEGER
    },
    password: {
      type: Sequelize.STRING
    },
    isActive:{
      type: Sequelize.BOOLEAN
    },
    updatedBy:{
      type: Sequelize.STRING
    }
  });
  return User;
};
