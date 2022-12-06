const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");

require('dotenv').config();

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};


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

require("./app/routes/public.routes")(app);
require("./app/routes/tenant.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/ticket.routes")(app);


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
