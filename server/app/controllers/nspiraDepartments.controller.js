const db = require("../models");
const NspiraDepartments = db.nspiraDepartments;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    NspiraDepartments.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving.",
            });
        });
};