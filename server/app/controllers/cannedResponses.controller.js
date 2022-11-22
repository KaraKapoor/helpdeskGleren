const db = require("../models");
const TicketReply = db.ticketReplies;
const Ticket = db.ticket;
const EmailTemplate = db.emailTemplate;
const TicketHistory = db.ticketHistory;
const User = db.user;
const Op = db.Sequelize.Op;
const constants = require("../constants/constants");
const Moment = require("moment");

exports.findCannedResponse = async (req, res) => {
  let cannedFilterName = req.body.cannedFilterName;
  let isAgent = req.body.isAgent;
  let ticketId = req.body.ticketId;

  if (cannedFilterName.match(constants.lbl_ORIGINAL_MESSAGE)) {
    /*If original message is selected send the Issue details */
    return Ticket.findOne({ where: { id: ticketId } })
      .then((resp => {
        for (const [key, value] of Object.entries(resp.dynamicFormJson)) {
          let search = "_";
          let replaceWith = "";
          let processString = key.toString().toLowerCase().split(search).join(replaceWith);
          if (processString.includes("issuedetails")) {
            res.send({ message: value });
          }
        }
      }))
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
  }

  if (cannedFilterName.match(constants.lbl_LAST_MESSAGE)) {
    /*If Last message is selected*/
    var condition = { where: { [Op.and]: [{ ticketId: req.body.ticketId }, { message: { [Op.not]: null } }, { textMessage: { [Op.is]: null } }, { usedInCannedFilters: true }] }, order: [['createdAt', 'DESC']] }
    return TicketReply.findOne(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });

  }
  if (cannedFilterName.match(constants.lbl_FULL_MESSAGE)) {
    /*If Full message is selected send all messages posted as well as the original message*/
    var condition = { where: { [Op.and]: [{ ticketId: req.body.ticketId }, { message: { [Op.not]: null } }, { textMessage: { [Op.is]: null } }, { usedInCannedFilters: true }] }, order: [['createdAt', 'ASC']] }
    return (
      Ticket.findOne({ where: { id: ticketId } })
        .then((resp => {
          for (const [key, value] of Object.entries(resp.dynamicFormJson)) {
            let search = "_";
            let replaceWith = "";
            let processString = key.toString().toLowerCase().split(search).join(replaceWith);
            if (processString.includes("issuedetails")) {
              TicketReply.findAll(condition)
                .then((data) => {
                  let respArray = [];
                  respArray.push({ message: value });
                  for (let obj of data) {
                    respArray.push(obj);
                  }
                  res.send(respArray);
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Some error occurred while retrieving.",
                  });
                });
            }
          }
        }))
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving.",
          });
        })
    )

  }
  if (cannedFilterName.match(constants.lbl_CLOSING_EMAIL_MESSAGE)) {

    await Ticket.findByPk(req.body.ticketId)
      .then(async (ticRes) => {
        let createdDateOfTicket = Moment(ticRes.createdAt).format('DD/MM/YYYY hh:mm A');
        await EmailTemplate.findOne({ where: { id: constants.CLOSE_TICKET_TEMPLATE_ID } })
          .then(async (emailRes) => {
            var EmailmapObj = {
              "%{ticket.number}": req.body.ticketId,
              "%{ticket.create_date}": createdDateOfTicket,
              "%{ticket.reopen_link}": constants.baseUrl + constants.CLOSE_TICKET + "?uuid=" + ticRes.feedbacklinkId,
            };
            let formattedMessage = emailRes.emailBody.replace(/%{ticket.number}|%{ticket.create_date}|%{ticket.reopen_link}/gi, function (matched) {
              return EmailmapObj[matched];
            });

            //Start-Fetch the details of all person involved in ticket
            await TicketHistory.findAll({ where: { ticketId: req.body.ticketId } })
              .then(async (historyResp) => {
                let recepientsArrayObj = [];
                for (let i of historyResp) {
                  if (i.updatedBy !== null) {
                    await User.findOne({ where: { id: i.updatedBy } })
                      .then((userRes) => {
                        //Check if value already exist.
                        if (recepientsArrayObj.some(recepient => recepient.label === userRes.email)) {
                          console.log("Value Exist");
                        } else {
                          recepientsArrayObj.push({ "value": i.updatedBy, "label": userRes.email });
                        }
                      })
                  }
                  if (i.transferreId !== null && i.transferreEmail !== null) {
                    //Check if value already exist.
                    if (recepientsArrayObj.some(recepient => recepient.label === i.transferreEmail)) {
                      continue;
                    } else {
                      recepientsArrayObj.push({ "value": i.transferreId, "label": i.transferreEmail });
                    }

                  }
                  if (i.assigneeId !== null) {
                    await User.findOne({ where: { id: i.assigneeId } })
                      .then(async (userResp) => {
                        if (recepientsArrayObj.some(recepient => recepient.label === userResp.email)) {
                          console.log("Value Exist");
                        } else {
                          recepientsArrayObj.push({ "value": userResp.id, "label": userResp.email });
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      })
                  }
                }
                res.send({ message: formattedMessage, recepients: recepientsArrayObj });
              })
            //End-Fetch the details of all person involved in ticket

          })
          .catch((err) => {
            console.log(err);
            res.send(err)
          })
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
  }
};