const db = require("../models");
const HelpTopic = db.helpTopic;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  HelpTopic.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving.",
      });
    });
};

exports.create = (req, res) => {
  // Validate request
  if (!req.body.helpTopicName) {
    res.status(400).send({
      message: "HelpTopic Name is mandatory",
    });
    return;
  }

  const helpTopic = {
    helpTopicName: req.body.helpTopicName,
    departmentId: req.body.departmentId,
    dynamicFormDetails: req.body.dynamicFormDetails,
  };

  HelpTopic.create(helpTopic)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating.",
      });
    });
};

exports.findByDepartmentId = (req, res) => {
  HelpTopic.findAll({
    where: { [Op.and]: [{ departmentId: req.body.departmentId }, { isActive: true }] },
    include: [
      {
        model: db.department,
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving.",
      });
    });
};

exports.findById = (req, res) => {
  const id = req.body.id;

  HelpTopic.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving.",
      });
    });
};
