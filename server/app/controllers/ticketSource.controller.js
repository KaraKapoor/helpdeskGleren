const db = require("../models");
const TicketSource = db.ticketSource;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
  try {
    console.log("*************************Find All Sources API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    await TicketSource.findAll()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
    console.log("*************************Find All Sources API Completed************************");
  } catch (exception) {
    console.log("*************************Find All Sources API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving.",
    });
  }

};

exports.create = async (req, res) => {
  try {
    console.log("*************************Create Source API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    // Validate request
    if (!req.body.sourceName) {
      res.status(400).send({
        message: "SourceName is mandatory",
      });
      return;
    }

    const source = {
      sourceName: req.body.sourceName,
    };

    await TicketSource.create(source)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating.",
        });
      });
    console.log("*************************Create Source API Completed************************");
  } catch (exception) {
    console.log("*************************Create Source API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while creating.",
    });
  }

};
