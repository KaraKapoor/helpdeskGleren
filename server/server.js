const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const emailJobs = require("./app/controllers/emailJobs.controller.js");
const larkIntegrationController = require("./app/controllers/larkIntegrationController.js");
require('dotenv').config();

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

cron.schedule("* * * * *", function () {
  if (process.env.IS_EVERY_MINUTE_EMAIL_JOB_REQUIRED === 'true') {
    console.log("Running a email job scheduler every 1 minute");
    emailJobs.findAll();
  }
});


cron.schedule("55 23 * * *", function () {
  if (process.env.IS_LARK_USER_CREATE_UPDATE_JOB_REQUIRED === 'true') {
    console.log("Running a user update job scheduler at 05:25 AM IST time.");
    larkIntegrationController.tenantInDepartments();
  }
});

// cron.schedule("* * * * *", function () {
//   if (process.env.IS_LOG_TABLE_DELETE_JOB_REQUIRED === 'true') {
//     console.log("Running a log table delete job scheduler at 05:25 AM IST time.");
//     larkIntegrationController.deletingLogTables();
//   }
// });

cron.schedule("30 23 * * *", function () {
  if (process.env.IS_LARK_DEPARTMENT_CREATE_UPDATE_JOB_REQUIRED === 'true') {
    console.log("Running a nspiraDepartment job scheduler at 05:00 AM IST time.");
    larkIntegrationController.populateAllDepartments();
  }
});



app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

require("./app/routes/ticketSource.routes")(app);
require("./app/routes/ticket.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/department.routes")(app);
require("./app/routes/helpTopic.routes")(app);
require("./app/routes/ticketReplies.routes")(app);
require("./app/routes/ticketHistory.routes")(app);
require("./app/routes/larkauth")(app);
require("./app/routes/emailTemplate.routes")(app);
require("./app/routes/larkIntegration.routes")(app);
require("./app/routes/schoolEscalation.routes")(app);
require("./app/routes/collegeEscalation.routes")(app);
require("./app/routes/nspiraDepartments.routes")(app);
require("./app/routes/emailJobs.routes")(app);
require("./app/routes/escalatedTickets.routes")(app);
require("./app/routes/administrativeEscalation.routes")(app);
require("./app/routes/file.routes")(app);
require("./app/routes/transferTicket.routes")(app);
require("./app/routes/dataExport.routes")(app);
require("./app/routes/cannedResponses.routes")(app);
require("./app/routes/generalMethods.routes")(app);
require("./app/routes/nspiraUserSettings.routes")(app);
require("./app/routes/dashboard.routes")(app);
require("./app/routes/agentDepartmentMapping.routes")(app);
require("./app/routes/team.routes")(app);
require("./app/routes/analytics.routes")(app);
require("./app/routes/tenantSettings.routes")(app);

// set port, listen for requests
const PORT = parseInt(process.env.PORT_NUMBER);


/*Starts--Code to run serve static react files in node server.*/

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/*Ends--Code to run serve static react files in node server.*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
