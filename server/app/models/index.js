const Sequelize = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.ticketSource = require("./ticketSource.model.js")(sequelize, Sequelize);
db.ticket = require("./ticket.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.department = require("./department.model.js")(sequelize, Sequelize);
db.helpTopic = require("./helpTopic.model.js")(sequelize, Sequelize);
db.ticketReplies = require("./ticketReplies.model")(sequelize, Sequelize);
db.ticketHistory = require("./ticketHistory.model.js")(sequelize, Sequelize);
db.emailTemplate = require("./emailTemplate.model.js")(sequelize, Sequelize);
db.schoolEscalation = require("./schoolEscalation.model.js")(sequelize, Sequelize);
db.collegeEscalation = require("./collegeEscalation.model.js")(sequelize, Sequelize);
db.administrativeEscalation = require("./administrativeEscalation.model.js")(sequelize, Sequelize);
db.nspiraDepartments = require("./nspiraDepartments.model.js")(sequelize, Sequelize);
db.emailJobs = require("./commsEmailJobs.model.js")(sequelize, Sequelize);
db.escalatedTickets = require("./escalatedTickets.model.js")(sequelize, Sequelize);
db.files = require("./files.model.js")(sequelize, Sequelize);
db.nspiraUserSettings = require("./nspiraUserSettings.model.js")(sequelize, Sequelize);
db.agentDepartmentMapping = require("./agentDepartmentMapping.model.js")(sequelize, Sequelize);
db.teams = require("./team.model.js")(sequelize, Sequelize);
db.teamLeadAssociations = require("./teamLeadAssociation.model.js")(sequelize, Sequelize);
db.teamLeadAgentDeptAssociations = require("./teamLeadAgentDepartmentAssociation.model.js")(sequelize, Sequelize);
db.tenantCoreSettings = require("./tenantSettings.model.js")(sequelize, Sequelize);
db.ticket.belongsTo(db.ticketSource, {
  foreignKey: "ticketSourceId", //1:1
});

db.ticket.belongsTo(db.department, {
  foreignKey: "departmentId", //1:1
});
db.ticket.belongsTo(db.helpTopic, {
  foreignKey: "helpTopicId", //1:1
});
db.ticket.belongsTo(db.user, {
  foreignKey: "userId", //1:1
});
db.nspiraUserSettings.belongsTo(db.user, {
  foreignKey: "userId", //1:1
});
db.department.hasMany(db.helpTopic, {
  foreignKey: "departmentId", //1:M
});
db.helpTopic.belongsTo(db.department, {
  foreignKey: "departmentId", //1:M Above reference
});
db.ticketReplies.belongsTo(db.ticket, {
  foreignKey: "ticketId", //1:1
});
db.ticketHistory.belongsTo(db.ticket, {
  foreignKey: "ticketId", //1:1
});
db.emailJobs.belongsTo(db.ticket, {
  foreignKey: "ticketId", //1:1
})
db.escalatedTickets.belongsTo(db.ticket, {
  foreignKey: "ticketId", //1:1
})
db.files.belongsTo(db.ticket, {
  foreignKey: "ticketId", //1:1
});
db.agentDepartmentMapping.belongsTo(db.user, {
  foreignKey: "userId", //1:1
});
db.agentDepartmentMapping.belongsTo(db.department, {
  foreignKey: "departmentId", //1:1
});
db.teamLeadAssociations.belongsTo(db.teams, {
  foreignKey: "teamId", //1:1
});
db.teamLeadAssociations.belongsTo(db.user, {
  foreignKey: "teamLeadId", //1:1
});
db.teamLeadAgentDeptAssociations.belongsTo(db.teamLeadAssociations, {
  foreignKey: "teamLeadAssociationId", //1:1
});
db.teamLeadAgentDeptAssociations.belongsTo(db.teams, {
  foreignKey: "teamId", //1:1
});
db.teamLeadAgentDeptAssociations.belongsTo(db.user, {
  foreignKey: "agentId", //1:1
});
db.teamLeadAgentDeptAssociations.belongsTo(db.department, {
  foreignKey: "departmentId", //1:1
});
module.exports = db;
