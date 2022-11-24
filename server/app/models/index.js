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

db.user.belongsTo(db.tenant, {
    foreignKey: "tenant_id", //1:1
});
module.exports = db;
