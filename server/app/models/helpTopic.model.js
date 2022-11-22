module.exports = (sequelize, Sequelize) => {
  const HelpTopic = sequelize.define("helptopics", {
    helpTopicName: {
      type: Sequelize.STRING,
    },
    dynamicFormDetails: {
      type: Sequelize.JSON,
    },
    module: {
      type: Sequelize.STRING
    },
    sla: {
      type: Sequelize.STRING
    },
    isActive: {
      type: Sequelize.BOOLEAN
    }
  });

  return HelpTopic;
};
