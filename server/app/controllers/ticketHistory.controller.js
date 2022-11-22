const db = require("../models");
const TicketHistory = db.ticketHistory;
const Op = db.Sequelize.Op;

exports.findTicketHistoryByTicketId = async (req, res) => {
    try {
        console.log("*************************Find Ticket History By Ticket ID API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        await TicketHistory.findAll({ where: { ticketId: req.body.ticketId }, order: [['createdAt', 'ASC']] })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving.",
                });
            });
        console.log("*************************Find Ticket History By Ticket ID API Completed ************************");
    } catch (exception) {
        console.log("*************************Find Ticket History By Ticket ID API Completed with Errors************************" + exception);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving.",
        });
    }

};

