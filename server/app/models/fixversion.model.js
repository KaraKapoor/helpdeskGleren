module.exports = (sequelize, Sequelize) => {
  const fixVersion = sequelize.define("fix_version", {
    fix_version: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });
  return fixVersion;
};
