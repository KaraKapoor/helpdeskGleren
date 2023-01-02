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

db.coreSetting = require("./corSetting.model.js")(sequelize, Sequelize);
db.emailVerify = require("./emailVerify.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.tenant = require("./tenant.model.js")(sequelize, Sequelize);
db.project = require("./project.model.js")(sequelize, Sequelize);
db.status = require("./status.model.js")(sequelize, Sequelize);
db.department = require("./department.model.js")(sequelize, Sequelize);
db.escalations = require("./escalation.model.js")(sequelize, Sequelize);
db.team = require("./team.model.js")(sequelize, Sequelize);
db.teamAgentAssociation = require("./teamAgentAssociation.model.js")(sequelize, Sequelize);
db.ticket = require("./ticket.model.js")(sequelize, Sequelize);
db.comments = require("./comments.model.js")(sequelize, Sequelize);
db.ticketHistory = require("./ticketHistory.model.js")(sequelize, Sequelize);
db.uploads = require("./uploads.model.js")(sequelize, Sequelize);
db.ticketFiles = require("./ticketFiles.model.js")(sequelize, Sequelize);
db.fix_version = require("./fixversion.model.js")(sequelize, Sequelize)

db.user.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.project.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.status.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.status.belongsTo(db.department, {
    foreignKey: "department_id", //1:1
});
db.department.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.user.belongsTo(db.department, {
    foreignKey: "department_id", //1:1
});
db.escalations.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.escalations.belongsTo(db.department, {
    foreignKey: "department_id", //1:1
});
db.escalations.belongsTo(db.user, {
    foreignKey: "l1_id", //1:1
});
db.escalations.belongsTo(db.user, {
    foreignKey: "l2_id", //1:1
});
db.escalations.belongsTo(db.user, {
    foreignKey: "l3_id", //1:1
});
db.escalations.belongsTo(db.user, {
    foreignKey: "l4_id", //1:1
});
db.escalations.belongsTo(db.user, {
    foreignKey: "l5_id", //1:1
});
db.escalations.belongsTo(db.user, {
    foreignKey: "l6_id", //1:1
});
db.team.belongsTo(db.user, {
    foreignKey: "created_by", //1:1
});
db.team.belongsTo(db.user, {
    foreignKey: "updated_by", //1:1
});
db.team.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.teamAgentAssociation.belongsTo(db.team, {
    foreignKey: "team_id", //1:1
});
db.teamAgentAssociation.belongsTo(db.user, {
    foreignKey: "team_lead_id", //1:1
});
db.teamAgentAssociation.belongsTo(db.user, {
    foreignKey: "agent_id", //1:1
});
db.teamAgentAssociation.belongsTo(db.user, {
    foreignKey: "user_id", //1:1
});
db.teamAgentAssociation.belongsTo(db.department, {
    foreignKey: "department_id", //1:1
});
db.teamAgentAssociation.belongsTo(db.project, {
    foreignKey: "project_id", //1:1
});
db.teamAgentAssociation.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.ticket.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.ticket.belongsTo(db.department, {
    foreignKey: "department_id", //1:1
});
db.ticket.belongsTo(db.project, {
    foreignKey: "project_id", //1:1
});
db.ticket.belongsTo(db.status, {
    foreignKey: "status_id", //1:1
});
db.ticket.belongsTo(db.user, {
    foreignKey: "created_by", //1:1
});
db.ticket.belongsTo(db.user, {
    foreignKey: "assignee_id", //1:1
});
db.comments.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.comments.belongsTo(db.ticket, {
    foreignKey: "ticket_id", //1:1
});
db.comments.belongsTo(db.user, {
    foreignKey: "created_by", //1:1
});
db.ticketHistory.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.ticketHistory.belongsTo(db.ticket, {
    foreignKey: "ticket_id", //1:1
});
db.uploads.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.uploads.belongsTo(db.user, {
    foreignKey: "uploaded_by", //1:1
});
db.ticketFiles.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
db.ticketFiles.belongsTo(db.ticket, {
    foreignKey: "ticket_id", //1:1
});
db.ticketFiles.belongsTo(db.uploads, {
    foreignKey: "upload_id", //1:1
});

module.exports = db;
