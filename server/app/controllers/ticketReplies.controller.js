const db = require("../models");
var { htmlToText } = require('html-to-text');
const TicketReplies = db.ticketReplies;
const User = db.user;
const Op = db.Sequelize.Op;
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const tenantCoreSettingsController = require("../controllers/tenantSettings.controller.js");

exports.findAllByTicketId = async (req, res) => {
    try {
        console.log("*************************Find Ticket Replies By Ticket ID API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        await TicketReplies.findAll({ where: { ticketId: req.body.ticketId }, order: [['createdAt', 'ASC']] })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving.",
                });
            });
        console.log("*************************Find Ticket Replies By Ticket ID API Completed************************");
    } catch (exception) {
        console.log("*************************Find Ticket Replies By Ticket ID API Completed with Errors************************" + exception);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving.",
        });
    }

};

exports.create = async (req, res) => {
    try {
        console.log("*************************Create Ticket Replies API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        let fullName = null;
        let isInternalNotes = req.body.isInternalNotes;
        //Fetch the userDetails
        await User.findOne({ where: { id: req.body.from } })
            .then(async (userRes) => {
                fullName = userRes.fullName;
                const ticketReplies = {
                    repliedby: fullName,
                    recepients: req.body.recepients,
                    message: req.body.message,
                    ticketId: req.body.ticketId,
                    s3FilesUrl: req.body.s3FilesUrl,
                    isInternalNotes: req.body.isInternalNotes,
                    usedInCannedFilters: req.body.usedInCannedFilters,
                };
                // create transporter object with smtp server details
                const transporter = await generalMethodsController.getEmailTransporter();
                const settingsResponse = await tenantCoreSettingsController.getSettingsByTenantName();

                var mailOptions = {
                    from: settingsResponse.dataValues.smtp_email,
                    to: req.body.to,
                    cc: req.body.recepients,
                    subject: 'Ticket#' + req.body.ticketId,
                    text: htmlToText(req.body.message)
                };
                await TicketReplies.create(ticketReplies)
                    .then(async (data) => {
                        if (isInternalNotes === false) {
                            await transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                        }

                        res.send(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).send({
                            message:"Some error occurred while posting reply.",
                        });
                    });
            })
        console.log("*************************Create Ticket Replies API Completed************************");
    } catch (exception) {
        console.log("*************************Create Ticket Replies API Completed with Errors************************" + exception);
        res.status(500).send({
            message: "Some error occurred while posting reply.",
        });
    }

};
