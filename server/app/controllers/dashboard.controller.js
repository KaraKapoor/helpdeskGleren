const db = require("../models");
const Op = db.Sequelize.Op;
const ticket = db.ticket;



exports.getPieChartDetailsForLoggedInUser = async (req, res) => {
    const userId = req.body.userId;
    const openStatus = ['Open', 'Awaiting for user response', 'Assigned to an engineer', 'Indent at Branch approval', 'Indent at DM approval', 'Indent at CO approval', 'Branch dependent', 'Warehouse dependent', 'Vendor dependent', 'Work in progress', 'Escalated to Next level', 'Resolved', 'Re-Open'];
    const closedStatus = ['Closed'];
    let openTicketCount = 0;
    let closedTicketCount = 0;
    let overdueTicketCount = 0;
    try {
        await ticket.count({ where: { [Op.and]: [{ assigneeId: userId }, { ticketStatus: { [Op.in]: openStatus } }] } })
            .then((data) => {
                openTicketCount = data;
            })
            .catch((err) => {
                console.log(err);
            });

        await ticket.count({ where: { [Op.and]: [{ assigneeId: userId }, { ticketStatus: { [Op.in]: closedStatus } }] } })
            .then((data) => {
                closedTicketCount = data;
            })
            .catch((err) => {
                console.log(err);
            });

        await ticket.count({ where: { [Op.and]: [{ assigneeId: userId }, { isTicketOverdue: 1 }] } })
            .then((data) => {
                overdueTicketCount = data;
            })
            .catch((err) => {
                res.status(200).send({
                    message: err.message || "Some error occurred while retrieving.",
                });
            });

        res.status(200).send({
            openTicketCount: openTicketCount,
            closedTicketCount: closedTicketCount,
            overdueTicketCount: overdueTicketCount
        })
    } catch (err) {
        console.log(err);
        res.status(200).send({
            message: "Some error occurred while retrieving.",
        });
    }

};