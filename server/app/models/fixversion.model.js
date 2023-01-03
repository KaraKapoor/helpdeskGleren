module.exports = (sequelize, Sequelize) => {
  const fixVersion = sequelize.define("fix_version", {
    fixversion: {
      type: Sequelize.STRING,
    },
    project_id: {
      type: Sequelize.INTEGER,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    tenantId: {
      type: Sequelize.INTEGER,
    },
  });
  return fixVersion;
};
