const db = require("../models");
const EmailTemplate = db.emailTemplate;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    EmailTemplate.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving.",
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.body.id;

    EmailTemplate.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(200).send({
                message: "Error retrieving Email Template with id=" + id
            });
        });
};

exports.create = (req, res) => {

    const emailTemplate = {
        templateName: req.body.templateName,
        subject: req.body.subject,
        emailBody: req.body.emailBody
    };

    EmailTemplate.create(emailTemplate)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating.",
            });
        });
};
