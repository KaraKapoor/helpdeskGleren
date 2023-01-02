module.exports = (sequelize, Sequelize) => {
  const fixVersion = sequelize.define("fix_version", {
    fixversion: {
      type: Sequelize.STRING,
    },
    project: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    ticket_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    tenantId: {
      type: Sequelize.INTEGER,
    },
  });
  return fixVersion;
};
