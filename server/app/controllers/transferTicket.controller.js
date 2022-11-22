const db = require("../models");
const Ticket = db.ticket;
const TicketHistory = db.ticketHistory;
const User = db.user;
const TicketReply = db.ticketReplies;
const Op = db.Sequelize.Op;
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const larkIntegrationController = require("../controllers/larkIntegrationController.js");
const constants = require("../constants/constants");
const EmailTemplate = db.emailTemplate;
var { htmlToText } = require('html-to-text');
require('dotenv').config();

exports.transferTicket = async (req, res) => {

  try {
    console.log("*************************Ticket Transfer API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));

    let isTicketWronglyAssigned = req.body.isTicketWronglyAssigned;
    let transferReason = req.body.transferReason;
    let departmentName = req.body.departmentName;
    let loggedInUserEmail = undefined;
    let ticketId = req.body.ticketId;
    let fullName = null;
    let previousDepartment = null;
    var updateTicketStatusOpen = false;
    let updatedBy = null;
    let selectedDepartment = req.body.selectedDepartment;
    let selectedAssignee = req.body.selectedAssignee;
    //Fetch the userDetails
    await User.findOne({ where: { id: req.body.transferreId } })
      .then((userRes) => {
        fullName = userRes.fullName;
        updatedBy = userRes.id;
        loggedInUserEmail = userRes.email;
      })
    if (selectedAssignee.value === 'CentralPoolAgent') {
      //Fetch ticket previous details.
      await Ticket.findOne({
        where: { id: ticketId }, include: [
          {
            model: db.user,
          },
          {
            model: db.department
          },
          {
            model: db.helpTopic
          }
        ]
      })
        .then(async (ticketRespo) => {
          let ticketSubject = await generalMethodsController.getKeyFromDynamicFormJson(ticketRespo.dynamicFormJson, 'issuesummary');
          let ticketDetails = await generalMethodsController.getKeyFromDynamicFormJson(ticketRespo.dynamicFormJson, 'issuedetails');
          //Start--Send Lark Alert
          const centralAgentsList = await User.findAll({ where: { helpdeskRole: 'Central Agent' } });
          for (let i of centralAgentsList) {
            const sendLarkAlertToCentralAgents = await larkIntegrationController.createLarkAlerts(i.openId, ticketRespo.id, ticketSubject, ticketDetails, ticketRespo.department.departmentName, ticketRespo.helptopic.helpTopicName, ticketRespo.user.fullName, ticketRespo.initialCreatedDate, ticketRespo.assigneeFullName, constants.lbl_ALERT_TYPE_TRANSFER_REQUEST, ticketRespo.ticketStatus);
          }
          //End--Send Lark Alert
          previousDepartment = ticketRespo.department.departmentName;
          if (ticketRespo.ticketStatus.toLowerCase() == "closed") {
            updateTicketStatusOpen = true;
          }

        })

      if (departmentName && transferReason) {
        let msgBody = constants.lbl_TRANSFER_TICKET;
        let EmailmapObj = {
          "%{fullName}": fullName,
          "%{previousDepartmentName}": previousDepartment,
          "%{departmentName}": departmentName,
          // "%{reason}": htmlToText(transferReason),

        };
        msgBody = msgBody.replace(/%{fullName}|%{previousDepartmentName}|%{departmentName}|}/gi, function (matched) {
          return EmailmapObj[matched];
        });

        let msgBody1 = constants.lbl_TRANSFER_REASON;
        let EmailmapObj1 = {
          "%{reason}": htmlToText(transferReason),

        };
        msgBody1 = msgBody1.replace(/%{reason}|}/gi, function (matched) {
          return EmailmapObj1[matched];
        });
        const ticketReplyObj = {
          message: msgBody,
          repliedby: fullName,
          ticketId: ticketId,
          textMessage: msgBody1,
          usedInCannedFilters: false

        }
        TicketReply.create(ticketReplyObj)
          .then(async (resp) => {
            //Always assigned the ticket to dummy user ie. email:=centralPoolAgents@nspira.com fullName:=Central Pool
            User.findOne({ where: { [Op.and]: [{ email: "centralPoolAgents@nspira.com" }, { fullName: "Central Pool" }] } })
              .then(async (userResp) => {
                if (userResp === null) {
                  return res.send({ "success": "false", "message": "User not found with Email centralPoolAgents@nspira.com" });
                }
                let updateObj = {
                  isTicketWronglyAssigned: isTicketWronglyAssigned,
                  isTicketTransferred: 1,
                  isTicketWithCentralPool: 1,
                  assigneeId: userResp.id,
                  assigneeFullName: userResp.fullName,
                  updatedBy: updatedBy
                }
                if (updateTicketStatusOpen == true) {
                  updateObj['ticketStatus'] = "Open"
                }
                await Ticket.update(updateObj, { where: { id: ticketId } })
                  .then(async (updateRes) => {
                    await insertDateInTicketHistory(ticketId);
                    res.send({ "success": "true" });

                  })
                  .catch((err) => {
                    console.log(err);
                  })
              })
              .catch((err) => {
                console.log(err);
              })

          })
          .catch((err) => {
            console.log(err);
          })
      } else if (departmentName) {
        let msgBody = constants.lbl_TRANSFER_TICKET;
        let EmailmapObj = {
          "%{fullName}": fullName,
          "%{previousDepartmentName}": previousDepartment,
          "%{departmentName}": departmentName,
          // "%{reason}": htmlToText(transferReason),

        };
        msgBody = msgBody.replace(/%{fullName}|%{previousDepartmentName}|%{departmentName}|}/gi, function (matched) {
          return EmailmapObj[matched];
        });

        let msgBody1 = constants.lbl_TRANSFER_REASON;
        let EmailmapObj1 = {
          "%{reason}": htmlToText("<p>NA</p>"),

        };
        msgBody1 = msgBody1.replace(/%{reason}|}/gi, function (matched) {
          return EmailmapObj1[matched];
        });
        const ticketReplyObj = {
          message: msgBody,
          textMessage: msgBody1,
          repliedby: loggedInUserEmail,
          ticketId: ticketId,
          usedInCannedFilters: false

        }
        TicketReply.create(ticketReplyObj)
          .then(async (resp) => {
            //Always assigned the ticket to dummy user ie. email:=centralPoolAgents@nspira.com fullName:=Central Pool
            User.findOne({ where: { [Op.and]: [{ email: "centralPoolAgents@nspira.com" }, { fullName: "Central Pool" }] } })
              .then(async (userResp) => {
                if (userResp === null) {
                  return res.send({ "success": "false", "message": "User not found with Email" + "centralPoolAgents@nspira.com" });
                }

                let updateObj = {
                  isTicketWronglyAssigned: isTicketWronglyAssigned,
                  isTicketTransferred: 1,
                  isTicketWithCentralPool: 1,
                  assigneeId: userResp.id,
                  assigneeFullName: userResp.fullName,
                  updatedBy: updatedBy
                }

                if (updateTicketStatusOpen == true) {
                  updateObj['ticketStatus'] = "Open"
                }

                await Ticket.update(updateObj, { where: { id: ticketId } })
                  .then(async (updateRes) => {
                    await insertDateInTicketHistory(ticketId);
                    res.send({ "success": "true" });

                  })
                  .catch((err) => {
                    console.log(err);
                  })
              })
              .catch((err) => {
                console.log(err);
              })
          })
          .catch((err) => {
            console.log(err);
          })
      }
      else {
        let msgBody = constants.lbl_TRANSFER_TICKET_1;
        let EmailmapObj = {
          "%{fullName}": fullName,
          "%{departmentName}": previousDepartment
        };
        msgBody = msgBody.replace(/%{fullName}|%{departmentName}|}/gi, function (matched) {
          return EmailmapObj[matched];
        });
        const ticketReplyObj = {
          message: msgBody,
          textMessage: "<p><strong>Transfer Reason: </strong>NA</p>",
          repliedby: loggedInUserEmail,
          ticketId: ticketId,
          usedInCannedFilters: false

        }
        TicketReply.create(ticketReplyObj)
          .then(async (resp) => {
            //Always assigned the ticket to dummy user ie. email:=centralPoolAgents@nspira.com fullName:=Central Pool
            User.findOne({ where: { [Op.and]: [{ email: "centralPoolAgents@nspira.com" }, { fullName: "Central Pool" }] } })
              .then(async (userResp) => {
                let updateObj = {
                  isTicketWronglyAssigned: isTicketWronglyAssigned,
                  isTicketTransferred: 1,
                  isTicketWithCentralPool: 1,
                  assigneeId: userResp.id,
                  assigneeFullName: userResp.fullName,
                  updatedBy: updatedBy
                }
                if (updateTicketStatusOpen == true) {
                  updateObj["ticketStatus"] = "Open"
                }
                await Ticket.update(updateObj, { where: { id: ticketId } })
                  .then(async (updateRes) => {
                    await insertDateInTicketHistory(ticketId);
                    res.send({ "success": "true" });

                  })
                  .catch((err) => {
                    console.log(err);
                  })
              })
              .catch((err) => {
                console.log(err);
              })
          })
          .catch((err) => {
            console.log(err);
          })
      }
    }

    //If selected assignee is not Central Pool then Trasnfer ticket to correct assignee.
    if (selectedAssignee.value !== 'CentralPoolAgent') {
      let transferreId = req.body.transferreId;
      let transferreEmail = undefined;
      let ticketId = req.body.ticketId;
      let createdAt = new Date();
      let transferreFullName = undefined;
      let updatedBy = undefined;
      let oldDepartmentName = undefined;
      let oldHelpTopicName = undefined;
      let assigneeBranchCode = undefined;
      //Fetch the userDetails
      await User.findOne({ where: { id: transferreId } })
        .then((userRes) => {
          transferreFullName = userRes.fullName;
          transferreEmail = userRes.email;
          updatedBy = userRes.id;
        })
      await Ticket.findOne({
        where: { id: ticketId }, include: [
          {
            model: db.department
          },
          {
            model: db.helpTopic
          }
        ]
      })
        .then(async (ticketRes) => {
          oldDepartmentName = ticketRes.department.departmentName;
          oldHelpTopicName = ticketRes.helptopic.helpTopicName;
          assigneeBranchCode = ticketRes.assigneeBranchCode;
          //Start processing the flow for transfer back.
          let isTicketSource = null;
          let ticketSourceHistoryId = null;
          if (ticketRes.isTicketWronglyAssigned === 1) {
            isTicketSource = null;
          } else if (ticketRes.isTicketWronglyAssigned === 0) {
            isTicketSource = true;
            await TicketHistory.findOne({ where: { [Op.not]: { assigneeFullName: "Central Pool" } }, order: [['createdAt', 'DESC']] })
              .then(async (histResp) => {
                ticketSourceHistoryId = histResp.id;
              })
          }
          //End processing the flow for transfer back.
          if (ticketRes.ticketStatus.toLowerCase() == "closed") {
            updateTicketStatusOpen = true;
          }
          let updateTicketObj = undefined;
          if (isTicketWronglyAssigned === 1) {

            let slaInMinutes = await generalMethodsController.calculateSLAMinutes(ticketRes.slaPlan);
            let level1SlaDueDate = await generalMethodsController.calculateSLATime(ticketRes.slaPlan);
            updateTicketObj = {
              id: ticketId,
              slaPlanInMinutes: slaInMinutes,
              departmentId: selectedAssignee.departmentId,
              helpTopicId: req.body.helpTopicId,
              assigneeId: selectedAssignee.value,
              assigneeFullName: selectedAssignee.assigneeName,
              transferreId: transferreId,
              transferreEmail: transferreEmail,
              isTicketWronglyAssigned: null,
              isTicketWithCentralPool: null,
              createdAt: createdAt,
              level1SlaDue: level1SlaDueDate,
              level2SlaDue: null,
              level3SlaDue: null,
              level4SlaDue: null,
              level5SlaDue: null,
              hodSlaDue: null,
              level1SlaTriggered: null,
              level2SlaTriggered: null,
              level3SlaTriggered: null,
              level4SlaTriggered: null,
              level5SlaTriggered: null,
              hodSlaTriggered: null,
              isTicketOverdue: null,
              isTicketSource: isTicketSource,
              ticketSourceHistoryId: ticketSourceHistoryId,
              updatedBy: updatedBy,
              assigneeBranchCode: assigneeBranchCode,

            }
            if (updateTicketStatusOpen == true) {
              updateTicketObj["ticketStatus"] = "Open"
            }
          }
          await Ticket.update(updateTicketObj, { where: { id: ticketId } })
            .then(async (updateResp) => {
              let msgBody = constants.lbl_INTER_DEPARTMENT_ASSIGN_TICKET;
              let mapObj = {
                "%{fullName}": transferreFullName,
                "%{departmentName}": departmentName,
                "%{assigneeName}": selectedAssignee.assigneeName
              }
              msgBody = msgBody.replace(/%{fullName}|%{departmentName}|%{assigneeName}|}/gi, function (matched) {
                return mapObj[matched];
              });
              let htmlMessage = msgBody;
              const ticketReplyObj = {
                repliedby: transferreEmail,
                ticketId: ticketId,
                message: htmlMessage,
                isTicketActivityThread: true,
                usedInCannedFilters: false
              };

              //Thread-2
              let msgBody1 = constants.lbl_INTER_DEPARTMENT_ASSIGN_TICKET_2;
              let mapObj1 = {
                "%{fullName}": transferreFullName,
                "%{departmentName}": departmentName,
                "%{oldDepartmentName}": oldDepartmentName,
              }
              msgBody1 = msgBody1.replace(/%{fullName}|%{departmentName}|%{oldDepartmentName}|}/gi, function (matched) {
                return mapObj1[matched];
              });
              let htmlMessage1 = msgBody1;
              await generalMethodsController.maintainTicketThread(transferreEmail, null, htmlMessage1, null, ticketId, null, null, true);
              await TicketReply.create(ticketReplyObj).
                then(async (replyRes) => {
                  await insertDateInTicketHistory(ticketId);

                  //Start-Send Email to Assignee
                  let baseUrl = process.env.BASE_URL;
                  let assigneeFullName = req.body.assigneeFullName;
                  let ticketNumber = ticketId;
                  let assigner = transferreEmail;
                  let ticketSubject = "";
                  let ticketDetails = "";
                  let helpTopicName = ""
                  let viewTicketLink = baseUrl + constants.VIEW_TICKET + ticketNumber;
                  let assigneeEmailTo = "";

                  await User.findByPk(selectedAssignee.value)
                    .then(async (userRes) => {
                      assigneeEmailTo = userRes.email;
                      Ticket.findOne({
                        where: { id: ticketId }, include: [
                          {
                            model: db.user,
                          },
                          {
                            model: db.ticketSource
                          },
                          {
                            model: db.department
                          },
                          {
                            model: db.helpTopic
                          }
                        ]
                      })
                        .then(async (ticRes) => {
                          helpTopicName = ticRes.helptopic.helpTopicName;
                          for (let i of Object.entries(ticRes.dynamicFormJson)) {
                            let processString = i[0].toString().toLowerCase().replace(/_/g, "")
                            if (processString.includes("issuesummary")) {
                              ticketSubject = i[1];
                            }
                            if (processString.includes("issuedetails")) {
                              ticketDetails = i[1];
                            }
                          }
                          await EmailTemplate.findByPk(constants.ASSIGNEE_TICKET_TEMPLATE_ID)
                            .then(async (emailTempRes) => {
                              let emailSubject = emailTempRes.subject;
                              let emailBody = emailTempRes.emailBody;
                              let EmailmapObj = {
                                "%{assignee.name.first}": assigneeFullName,
                                "%%7Bticket.staff_link%7D": viewTicketLink,
                                "%{ticket.number}": ticketNumber,
                                "%{assigner.name.short}": assigner,
                                "%{ticket.name}": helpTopicName,
                                "%{ticket.subject}": ticketSubject,
                                "%{ticket.topic.name}": helpTopicName,
                                "%{ticket.thread.original}": ticketDetails
                              };
                              emailBody = emailBody.replace(/%{assignee.name.first}|%%7Bticket.staff_link%7D|%{ticket.number}|%{assigner.name.short}|%{ticket.name}|%{ticket.subject}|%{ticket.topic.name}|%{ticket.thread.original}/gi, function (matched) {
                                return EmailmapObj[matched];
                              });

                              sendEmailRes = await generalMethodsController.sendEmail(assigneeEmailTo, emailSubject, "", emailBody);
                              res.send({ "success": "true" });
                            })
                            .catch((err) => {
                              console.log(err);
                            })
                        })
                    })
                    .catch((err) => {
                      console.log(err);
                    })

                  //End-Send Email to Assignee
                })
                .catch((err) => {
                  console.log(err);
                  res.send(err);
                })
            })
            .catch((err) => {
              console.log(err);
              res.send(err);
            })

        })
        .catch((err) => {
          console.log(err);
        })

    }
    console.log("*************************Ticket Transfer API Completed************************");
  }
  catch (err) {
    console.log("*************************Ticket Transfer API Completed with Errors************************" + exception);
    return res.send({ success: false, message: "Some error occurred while performing the operation" });
  }
};


async function insertDateInTicketHistory(ticketId) {
  await Ticket.findOne({ where: { id: ticketId } })
    .then((resp) => {

      const ticketHistoryObj = {
        email: resp.email,
        fullName: resp.fullName,
        ticketNotice: resp.ticketNotice,
        ticketSourceId: resp.ticketSourceId,
        departmentId: resp.departmentId,
        helpTopicId: resp.helpTopicId,
        userId: resp.userId,
        slaPlan: resp.slaPlan,
        assigneeFullName: resp.assigneeFullName,
        assigneeId: resp.assigneeId,
        ticketStatus: resp.ticketStatus,
        branch: resp.branch,
        schCol: resp.schCol,
        dynamicFormJson: resp.dynamicFormJson,
        dynamicFormField1: resp.dynamicFormField1,
        dynamicFormField2: resp.dynamicFormField2,
        dynamicFormField3: resp.dynamicFormField3,
        dynamicFormField4: resp.dynamicFormField4,
        dynamicFormField5: resp.dynamicFormField5,
        dynamicFormField6: resp.dynamicFormField6,
        dynamicFormField7: resp.dynamicFormField7,
        dynamicFormField8: resp.dynamicFormField8,
        dynamicFormField9: resp.dynamicFormField9,
        dynamicFormField10: resp.dynamicFormField10,
        dynamicFormField11: resp.dynamicFormField11,
        dynamicFormField12: resp.dynamicFormField12,
        dynamicFormField13: resp.dynamicFormField13,
        dynamicFormField14: resp.dynamicFormField14,
        dynamicFormField15: resp.dynamicFormField15,
        dynamicFormField16: resp.dynamicFormField16,
        dynamicFormField17: resp.dynamicFormField17,
        dynamicFormField18: resp.dynamicFormField18,
        dynamicFormField19: resp.dynamicFormField19,
        dynamicFormField20: resp.dynamicFormField20,
        dynamicFormField21: resp.dynamicFormField21,
        dynamicFormField22: resp.dynamicFormField22,
        dynamicFormField23: resp.dynamicFormField23,
        dynamicFormField24: resp.dynamicFormField24,
        dynamicFormField25: resp.dynamicFormField25,
        dynamicFormField26: resp.dynamicFormField26,
        dynamicFormField27: resp.dynamicFormField27,
        dynamicFormField28: resp.dynamicFormField28,
        dynamicFormField29: resp.dynamicFormField29,
        dynamicFormField30: resp.dynamicFormField30,
        dynamicFormField31: resp.dynamicFormField31,
        dynamicFormField32: resp.dynamicFormField32,
        dynamicFormField33: resp.dynamicFormField33,
        dynamicFormField34: resp.dynamicFormField34,
        dynamicFormField35: resp.dynamicFormField35,
        dynamicFormField36: resp.dynamicFormField36,
        dynamicFormField37: resp.dynamicFormField37,
        dynamicFormField38: resp.dynamicFormField38,
        dynamicFormField39: resp.dynamicFormField39,
        dynamicFormField40: resp.dynamicFormField40,
        createdAt: new Date(),
        updatedAt: new Date(),
        ticketId: ticketId,
        slaPlanInMinutes: resp.slaPlanInMinutes,
        level1SlaDue: resp.level1SlaDue,
        level2SlaDue: resp.level2SlaDue,
        level3SlaDue: resp.level3SlaDue,
        level4SlaDue: resp.level4SlaDue,
        level5SlaDue: resp.level5SlaDue,
        hodSlaDue: resp.hodSlaDue,
        level1SlaTriggered: resp.level1SlaTriggered,
        level2SlaTriggered: resp.level2SlaTriggered,
        level3SlaTriggered: resp.level3SlaTriggered,
        level4SlaTriggered: resp.level4SlaTriggered,
        level5SlaTriggered: resp.level5SlaTriggered,
        hodSlaTriggered: resp.hodSlaTriggered,
        ticketCategory: resp.ticketCategory,
        closedDate: resp.closedDate,
        employeeNo: resp.employeeNo,
        isTicketWronglyAssigned: resp.isTicketWronglyAssigned,
        isTicketTransferred: resp.isTicketTransferred,
        isTicketWithCentralPool: resp.isTicketWithCentralPool,
        openDepartmentIdOfUser: resp.openDepartmentIdOfUser,
        transferreId: resp.transferreId,
        transferreEmail: resp.transferreEmail,
        isTicketSource: resp.isTicketSource,
        ticketSourceHistoryId: resp.ticketSourceHistoryId,
        assigneeBranchCode: resp.assigneeBranchCode,
        updatedBy: resp.updatedBy,

      }

      TicketHistory.create(ticketHistoryObj)
        .then(async (historyResp) => {

        })
    })
}

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tickets } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, tickets, totalPages, currentPage };
};

exports.getAllTransferredTickets = async (req, res) => {
  try {
    console.log("*************************Get All Transfer Tickets API Started************************");
    console.log("INPUT" + JSON.stringify(req.query));
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const queryParam = req.query.searchParam;
    let ticketStatus = req.query.ticketStatus;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let sortColumns;

    if (orderBy !== undefined && orderBy !== "undefined") {
      if (orderBy === 'id') {
        sortColumns = ['id', orderDirection];
      } else if (orderBy === 'initialCreatedDate') {
        sortColumns = ['initialCreatedDate', orderDirection];
      } else if (orderBy === 'subject') {
        sortColumns = ['dynamicFormJson', orderDirection];
      } else if (orderBy === 'fullName') {
        sortColumns = ['fullName', orderDirection];
      } else if (orderBy === 'assigneeFullName') {
        sortColumns = ['assigneeFullName', orderDirection];
      } else if (orderBy === 'branch') {
        sortColumns = ['branch', orderDirection];
      } else if (orderBy === 'schCol') {
        sortColumns = ['schCol', orderDirection];
      } else if (orderBy === 'ticketStatus') {
        sortColumns = ['ticketStatus', orderDirection];
      } else if (orderBy === 'departmentName') {
        sortColumns = ['departmentId', orderDirection];
      } else if (orderBy === 'level1DueDate') {
        sortColumns = ['level1SlaDue', orderDirection];
      } else if (orderBy === 'closedDate') {
        sortColumns = ['closedDate', orderDirection];
      }
      else {
        sortColumns = ['createdAt', 'DESC'];
      }
    } else {
      sortColumns = ['createdAt', 'DESC'];
    }

    /*Start- Prepare condition set based on userInput */

    //Start-Condition One- (With Status "All")
    if (ticketStatus === "All" || ticketStatus === '') {
      var condition = { [Op.and]: [{ createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } }, { isTicketWithCentralPool: 1 }, { ticketStatus: { [Op.not]: "Closed" } }] }
    }
    //End- Condtion One

    //Start-Condition Two- (With Custom Status Only)
    else {
      const status = ticketStatus.split(",");
      var condition = { [Op.and]: [{ ticketStatus: { [Op.in]: status } }, { createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } }, { isTicketWithCentralPool: 1 }, { ticketStatus: { [Op.not]: "Closed" } }] }
    }
    //End- Condtion Two

    //Start-Condition Three- (Search Param Only)
    if (queryParam !== "" && queryParam !== null) {
      var condition = { [Op.and]: [{ id: `${queryParam}` }, { isTicketWithCentralPool: 1 }, { ticketStatus: { [Op.not]: "Closed" } }] }
    }
    //End- Condtion Three

    await Ticket.findAndCountAll({
      limit, offset, where: condition, include: [
        {
          model: db.department
        },
        {
          model: db.user
        }
      ], order: [sortColumns,],
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tickets."
        });
      });
    console.log("*************************Get All Transfer Tickets API Completed************************");
  } catch (exception) {
    console.log("*************************Get All Transfer Tickets API Completed with Errors************************" + exception);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tickets."
    });
  }

}
exports.interDepartmentUpdateTicket = async (req, res) => {
  try {
    console.log("*************************Inter Department Update Ticket API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    let departmentId = req.body.departmentId;
    let helpTopicId = req.body.helpTopicId;
    let helpTopicName = req.body.helpTopicName;
    let assigneeId = req.body.assigneeId;
    let assigneeFullName = req.body.assigneeFullName;
    let dynamicFormJson = req.body.dynamicFormJson;
    let transferreId = req.body.transferreId;
    let transferreEmail = req.body.transferreEmail;
    let ticketId = req.body.ticketId;
    let departmentName = req.body.departmentName;
    let createdAt = new Date();
    let updateTicketObj = {};
    let transferreFullName = null;
    let oldDepartmentName = null;
    let oldHelpTopicName = null;
    let updatedBy = null;
    let assigneeBranchCode = null;
    let ticketSubCategory = null;
    //Fetch the userDetails
    await User.findOne({ where: { email: transferreEmail } })
      .then((userRes) => {
        transferreFullName = userRes.fullName;
        updatedBy = userRes.id;
      })
    await Ticket.findOne({
      where: { id: ticketId }, include: [
        {
          model: db.department
        },
        {
          model: db.helpTopic
        }
      ]
    })
      .then(async (ticketRes) => {
        oldDepartmentName = ticketRes.department.departmentName;
        oldHelpTopicName = ticketRes.helptopic.helpTopicName;
        assigneeBranchCode = ticketRes.assigneeBranchCode;
        //Start processing the flow for transfer back.
        let isTicketSource = null;
        let ticketSourceHistoryId = null;
        if (ticketRes.isTicketWronglyAssigned === 1) {
          isTicketSource = null;
        } else if (ticketRes.isTicketWronglyAssigned === 0) {
          isTicketSource = true;
          await TicketHistory.findOne({ where: { [Op.not]: { assigneeFullName: "Central Pool" } }, order: [['createdAt', 'DESC']] })
            .then(async (histResp) => {
              ticketSourceHistoryId = histResp.id;
            })
        }
        //End processing the flow for transfer back.
        let dynamicFormField1 = null
        let dynamicFormField2 = null
        let dynamicFormField3 = null
        let dynamicFormField4 = null
        let dynamicFormField5 = null
        let dynamicFormField6 = null
        let dynamicFormField7 = null
        let dynamicFormField8 = null
        let dynamicFormField9 = null
        let dynamicFormField10 = null
        let dynamicFormField11 = null
        let dynamicFormField12 = null
        let dynamicFormField13 = null
        let dynamicFormField14 = null
        let dynamicFormField15 = null
        let dynamicFormField16 = null
        let dynamicFormField17 = null
        let dynamicFormField18 = null
        let dynamicFormField19 = null
        let dynamicFormField20 = null
        let dynamicFormField21 = null
        let dynamicFormField22 = null
        let dynamicFormField23 = null
        let dynamicFormField24 = null
        let dynamicFormField25 = null
        let dynamicFormField26 = null
        let dynamicFormField27 = null
        let dynamicFormField28 = null
        let dynamicFormField29 = null
        let dynamicFormField30 = null
        let dynamicFormField31 = null
        let dynamicFormField32 = null
        let dynamicFormField33 = null
        let dynamicFormField34 = null
        let dynamicFormField35 = null
        let dynamicFormField36 = null
        let dynamicFormField37 = null
        let dynamicFormField38 = null
        let dynamicFormField39 = null
        let dynamicFormField40 = null
        let counter = 0;
        for (let obj of Object.entries(req.body.dynamicFormJson)) {
          if (obj[0].endsWith('Sub_Category')) {
            ticketSubCategory = obj[1];
          }
          counter++;
          if (counter == 1) {
            dynamicFormField1 = obj.toString();
            continue;
          }
          if (counter == 2) {
            dynamicFormField2 = obj.toString();
            continue;
          }
          if (counter == 3) {
            dynamicFormField3 = obj.toString();
            continue;
          }
          if (counter == 4) {
            dynamicFormField4 = obj.toString();
            continue;
          }
          if (counter == 5) {
            dynamicFormField5 = obj.toString();
            continue;
          }
          if (counter == 6) {
            dynamicFormField6 = obj.toString();
            continue;
          }
          if (counter == 7) {
            dynamicFormField7 = obj.toString();
            continue;
          }
          if (counter == 8) {
            dynamicFormField8 = obj.toString();
            continue;
          }
          if (counter == 9) {
            dynamicFormField9 = obj.toString();
            continue;
          }
          if (counter == 10) {
            dynamicFormField10 = obj.toString();
            continue;
          }
          if (counter == 11) {
            dynamicFormField11 = obj.toString();
            continue;
          }
          if (counter == 12) {
            dynamicFormField12 = obj.toString();
            continue;
          }
          if (counter == 13) {
            dynamicFormField13 = obj.toString();
            continue;
          }
          if (counter == 14) {
            dynamicFormField14 = obj.toString();
            continue;
          }
          if (counter == 15) {
            dynamicFormField15 = obj.toString();
            continue;
          }
          if (counter == 16) {
            dynamicFormField16 = obj.toString();
            continue;
          }
          if (counter == 17) {
            dynamicFormField17 = obj.toString();
            continue;
          }
          if (counter == 18) {
            dynamicFormField18 = obj.toString();
            continue;
          }
          if (counter == 19) {
            dynamicFormField19 = obj.toString();
            continue;
          }
          if (counter == 20) {
            dynamicFormField20 = obj.toString();
            continue;
          }
          if (counter == 21) {
            dynamicFormField21 = obj.toString();
            continue;
          }
          if (counter == 22) {
            dynamicFormField22 = obj.toString();
            continue;
          }
          if (counter == 23) {
            dynamicFormField23 = obj.toString();
            continue;
          }
          if (counter == 24) {
            dynamicFormField24 = obj.toString();
            continue;
          }
          if (counter == 25) {
            dynamicFormField25 = obj.toString();
            continue;
          }
          if (counter == 26) {
            dynamicFormField26 = obj.toString();
            continue;
          }
          if (counter == 27) {
            dynamicFormField27 = obj.toString();
            continue;
          }
          if (counter == 28) {
            dynamicFormField28 = obj.toString();
            continue;
          }
          if (counter == 29) {
            dynamicFormField29 = obj.toString();
            continue;
          }
          if (counter == 30) {
            dynamicFormField30 = obj.toString();
            continue;
          }
          if (counter == 31) {
            dynamicFormField31 = obj.toString();
            continue;
          }
          if (counter == 32) {
            dynamicFormField32 = obj.toString();
            continue;
          }
          if (counter == 33) {
            dynamicFormField33 = obj.toString();
            continue;
          }
          if (counter == 34) {
            dynamicFormField34 = obj.toString();
            continue;
          }
          if (counter == 35) {
            dynamicFormField35 = obj.toString();
            continue;
          }
          if (counter == 36) {
            dynamicFormField36 = obj.toString();
            continue;
          }
          if (counter == 37) {
            dynamicFormField37 = obj.toString();
            continue;
          }
          if (counter == 38) {
            dynamicFormField38 = obj.toString();
            continue;
          }
          if (counter == 39) {
            dynamicFormField39 = obj.toString();
            continue;
          }
          if (counter == 40) {
            dynamicFormField40 = obj.toString();
            continue;
          }

        }
        if (ticketRes.isTicketWronglyAssigned === 1) {

          let slaInMinutes = await generalMethodsController.calculateSLAMinutes(ticketRes.slaPlan);
          let level1SlaDueDate = await generalMethodsController.calculateSLATime(ticketRes.slaPlan);
          updateTicketObj = {
            id: ticketId,
            slaPlanInMinutes: slaInMinutes,
            departmentId: departmentId,
            helpTopicId: helpTopicId,
            assigneeId: assigneeId,
            assigneeFullName: assigneeFullName,
            dynamicFormJson: dynamicFormJson,
            transferreId: transferreId,
            transferreEmail: transferreEmail,
            isTicketWronglyAssigned: null,
            isTicketWithCentralPool: null,
            createdAt: createdAt,
            level1SlaDue: level1SlaDueDate,
            level2SlaDue: null,
            level3SlaDue: null,
            level4SlaDue: null,
            level5SlaDue: null,
            hodSlaDue: null,
            level1SlaTriggered: null,
            level2SlaTriggered: null,
            level3SlaTriggered: null,
            level4SlaTriggered: null,
            level5SlaTriggered: null,
            hodSlaTriggered: null,
            dynamicFormField1: dynamicFormField1,
            dynamicFormField2: dynamicFormField2,
            dynamicFormField3: dynamicFormField3,
            dynamicFormField4: dynamicFormField4,
            dynamicFormField5: dynamicFormField5,
            dynamicFormField6: dynamicFormField6,
            dynamicFormField7: dynamicFormField7,
            dynamicFormField8: dynamicFormField8,
            dynamicFormField9: dynamicFormField9,
            dynamicFormField10: dynamicFormField10,
            dynamicFormField11: dynamicFormField11,
            dynamicFormField12: dynamicFormField12,
            dynamicFormField13: dynamicFormField13,
            dynamicFormField14: dynamicFormField14,
            dynamicFormField15: dynamicFormField15,
            dynamicFormField16: dynamicFormField16,
            dynamicFormField17: dynamicFormField17,
            dynamicFormField18: dynamicFormField18,
            dynamicFormField19: dynamicFormField19,
            dynamicFormField20: dynamicFormField20,
            dynamicFormField21: dynamicFormField21,
            dynamicFormField22: dynamicFormField22,
            dynamicFormField23: dynamicFormField23,
            dynamicFormField24: dynamicFormField24,
            dynamicFormField25: dynamicFormField25,
            dynamicFormField26: dynamicFormField26,
            dynamicFormField27: dynamicFormField27,
            dynamicFormField28: dynamicFormField28,
            dynamicFormField29: dynamicFormField29,
            dynamicFormField30: dynamicFormField30,
            dynamicFormField31: dynamicFormField31,
            dynamicFormField32: dynamicFormField32,
            dynamicFormField33: dynamicFormField33,
            dynamicFormField34: dynamicFormField34,
            dynamicFormField35: dynamicFormField35,
            dynamicFormField36: dynamicFormField36,
            dynamicFormField37: dynamicFormField37,
            dynamicFormField38: dynamicFormField38,
            dynamicFormField39: dynamicFormField39,
            dynamicFormField40: dynamicFormField40,
            isTicketSource: isTicketSource,
            ticketSourceHistoryId: ticketSourceHistoryId,
            updatedBy: updatedBy,
            assigneeBranchCode: assigneeBranchCode,
            ticketSubCategory: ticketSubCategory,
            isTicketOverdue: null

          }
        } else {
          updateTicketObj = {
            id: ticketId,
            departmentId: departmentId,
            helpTopicId: helpTopicId,
            assigneeId: assigneeId,
            assigneeFullName: assigneeFullName,
            dynamicFormJson: dynamicFormJson,
            transferreId: transferreId,
            transferreEmail: transferreEmail,
            isTicketWronglyAssigned: null,
            isTicketWithCentralPool: null,
            dynamicFormField1: dynamicFormField1,
            dynamicFormField2: dynamicFormField2,
            dynamicFormField3: dynamicFormField3,
            dynamicFormField4: dynamicFormField4,
            dynamicFormField5: dynamicFormField5,
            dynamicFormField6: dynamicFormField6,
            dynamicFormField7: dynamicFormField7,
            dynamicFormField8: dynamicFormField8,
            dynamicFormField9: dynamicFormField9,
            dynamicFormField10: dynamicFormField10,
            dynamicFormField11: dynamicFormField11,
            dynamicFormField12: dynamicFormField12,
            dynamicFormField13: dynamicFormField13,
            dynamicFormField14: dynamicFormField14,
            dynamicFormField15: dynamicFormField15,
            dynamicFormField16: dynamicFormField16,
            dynamicFormField17: dynamicFormField17,
            dynamicFormField18: dynamicFormField18,
            dynamicFormField19: dynamicFormField19,
            dynamicFormField20: dynamicFormField20,
            dynamicFormField21: dynamicFormField21,
            dynamicFormField22: dynamicFormField22,
            dynamicFormField23: dynamicFormField23,
            dynamicFormField24: dynamicFormField24,
            dynamicFormField25: dynamicFormField25,
            dynamicFormField26: dynamicFormField26,
            dynamicFormField27: dynamicFormField27,
            dynamicFormField28: dynamicFormField28,
            dynamicFormField29: dynamicFormField29,
            dynamicFormField30: dynamicFormField30,
            dynamicFormField31: dynamicFormField31,
            dynamicFormField32: dynamicFormField32,
            dynamicFormField33: dynamicFormField33,
            dynamicFormField34: dynamicFormField34,
            dynamicFormField35: dynamicFormField35,
            dynamicFormField36: dynamicFormField36,
            dynamicFormField37: dynamicFormField37,
            dynamicFormField38: dynamicFormField38,
            dynamicFormField39: dynamicFormField39,
            dynamicFormField40: dynamicFormField40,
            isTicketSource: isTicketSource,
            ticketSourceHistoryId: ticketSourceHistoryId,
            updatedBy: updatedBy,
            assigneeBranchCode: assigneeBranchCode,
            isTicketOverdue: null

          }
        }
        await Ticket.update(updateTicketObj, { where: { id: ticketId } })
          .then(async (updateResp) => {
            let msgBody = constants.lbl_INTER_DEPARTMENT_ASSIGN_TICKET;
            let mapObj = {
              "%{fullName}": transferreFullName,
              "%{departmentName}": departmentName,
              "%{assigneeName}": assigneeFullName
            }
            msgBody = msgBody.replace(/%{fullName}|%{departmentName}|%{assigneeName}|}/gi, function (matched) {
              return mapObj[matched];
            });
            let htmlMessage = msgBody;
            const ticketReplyObj = {
              repliedby: transferreEmail,
              ticketId: ticketId,
              message: htmlMessage,
              isTicketActivityThread: true,
              usedInCannedFilters: false
            };

            //Thread-2
            let msgBody1 = constants.lbl_INTER_DEPARTMENT_ASSIGN_TICKET_1;
            let mapObj1 = {
              "%{fullName}": transferreFullName,
              "%{helpTopicName}": helpTopicName,
              "%{departmentName}": departmentName,
              "%{oldHelpTopicName}": oldHelpTopicName,
              "%{oldDepartmentName}": oldDepartmentName,
            }
            msgBody1 = msgBody1.replace(/%{fullName}|%{helpTopicName}|%{departmentName}|%{oldHelpTopicName}|%{oldDepartmentName}|}/gi, function (matched) {
              return mapObj1[matched];
            });
            let htmlMessage1 = msgBody1;
            await generalMethodsController.maintainTicketThread(transferreEmail, null, htmlMessage1, null, ticketId, null, null, true);
            await TicketReply.create(ticketReplyObj).
              then(async (replyRes) => {
                await insertDateInTicketHistory(ticketId);

                //Start-Send Email to Assignee
                let baseUrl = process.env.BASE_URL;
                let assigneeFullName = req.body.assigneeFullName;
                let ticketNumber = ticketId;
                let assigner = transferreEmail;
                let ticketSubject = "";
                let ticketDetails = "";
                let helpTopicName = ""
                let viewTicketLink = baseUrl + constants.VIEW_TICKET + ticketNumber;
                let assigneeEmailTo = "";

                await User.findByPk(assigneeId)
                  .then(async (userRes) => {
                    assigneeEmailTo = userRes.email;
                    Ticket.findOne({
                      where: { id: ticketId }, include: [
                        {
                          model: db.user,
                        },
                        {
                          model: db.ticketSource
                        },
                        {
                          model: db.department
                        },
                        {
                          model: db.helpTopic
                        }
                      ]
                    })
                      .then(async (ticRes) => {
                        helpTopicName = ticRes.helptopic.helpTopicName;
                        for (let i of Object.entries(ticRes.dynamicFormJson)) {
                          let processString = i[0].toString().toLowerCase().replace(/_/g, "")
                          if (processString.includes("issuesummary")) {
                            ticketSubject = i[1];
                          }
                          if (processString.includes("issuedetails")) {
                            ticketDetails = i[1];
                          }
                        }
                        await EmailTemplate.findByPk(constants.ASSIGNEE_TICKET_TEMPLATE_ID)
                          .then(async (emailTempRes) => {
                            let emailSubject = emailTempRes.subject;
                            let emailBody = emailTempRes.emailBody;
                            let EmailmapObj = {
                              "%{assignee.name.first}": assigneeFullName,
                              "%%7Bticket.staff_link%7D": viewTicketLink,
                              "%{ticket.number}": ticketNumber,
                              "%{assigner.name.short}": assigner,
                              "%{ticket.name}": helpTopicName,
                              "%{ticket.subject}": ticketSubject,
                              "%{ticket.topic.name}": helpTopicName,
                              "%{ticket.thread.original}": ticketDetails
                            };
                            emailBody = emailBody.replace(/%{assignee.name.first}|%%7Bticket.staff_link%7D|%{ticket.number}|%{assigner.name.short}|%{ticket.name}|%{ticket.subject}|%{ticket.topic.name}|%{ticket.thread.original}/gi, function (matched) {
                              return EmailmapObj[matched];
                            });

                            sendEmailRes = await generalMethodsController.sendEmail(assigneeEmailTo, emailSubject, "", emailBody);
                            res.send({ "success": "true" });
                          })
                          .catch((err) => {
                            console.log(err);
                          })
                      })
                  })
                  .catch((err) => {
                    console.log(err);
                  })

                //End-Send Email to Assignee
              })
              .catch((err) => {
                console.log(err);
                res.send(err);
              })
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          })

      })
      .catch((err) => {
        console.log(err);
      })
    console.log("*************************Inter Department Update Ticket API Completed************************");
  } catch (exception) {
    console.log("*************************Inter Department Update Ticket API Completed with Errors************************" + exception);
  }


}

exports.transferBackTicket = async (req, res) => {
  try {
    console.log("*************************Transfer Back Ticket API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    let ticketId = req.body.ticketId;
    let ticketSourceHistoryId = req.body.ticketSourceHistoryId;
    let loggedInUserId = req.body.loggedInUserId;
    let loggedInUserEmail = undefined;
    let departmentName = null;
    let updatedBy = null;
    await User.findOne({ where: { id: loggedInUserId } })
      .then((userRes) => {
        updatedBy = userRes.id;
        loggedInUserEmail = userRes.email;
      })


    await TicketHistory.findOne({ where: { id: ticketSourceHistoryId } })
      .then(async (historyResp) => {
        const ticketObj = {
          departmentId: historyResp.departmentId,
          helpTopicId: historyResp.helpTopicId,
          assigneeFullName: historyResp.assigneeFullName,
          assigneeId: historyResp.assigneeId,
          dynamicFormJson: historyResp.dynamicFormJson,
          dynamicFormField1: historyResp.dynamicFormField1,
          dynamicFormField2: historyResp.dynamicFormField2,
          dynamicFormField3: historyResp.dynamicFormField3,
          dynamicFormField4: historyResp.dynamicFormField4,
          dynamicFormField5: historyResp.dynamicFormField5,
          dynamicFormField6: historyResp.dynamicFormField6,
          dynamicFormField7: historyResp.dynamicFormField7,
          dynamicFormField8: historyResp.dynamicFormField8,
          dynamicFormField9: historyResp.dynamicFormField9,
          dynamicFormField10: historyResp.dynamicFormField10,
          dynamicFormField11: historyResp.dynamicFormField11,
          dynamicFormField12: historyResp.dynamicFormField12,
          dynamicFormField13: historyResp.dynamicFormField13,
          dynamicFormField14: historyResp.dynamicFormField14,
          dynamicFormField15: historyResp.dynamicFormField15,
          dynamicFormField16: historyResp.dynamicFormField16,
          dynamicFormField17: historyResp.dynamicFormField17,
          dynamicFormField18: historyResp.dynamicFormField18,
          dynamicFormField19: historyResp.dynamicFormField19,
          dynamicFormField20: historyResp.dynamicFormField20,
          dynamicFormField21: historyResp.dynamicFormField21,
          dynamicFormField22: historyResp.dynamicFormField22,
          dynamicFormField23: historyResp.dynamicFormField23,
          dynamicFormField24: historyResp.dynamicFormField24,
          dynamicFormField25: historyResp.dynamicFormField25,
          dynamicFormField26: historyResp.dynamicFormField26,
          dynamicFormField27: historyResp.dynamicFormField27,
          dynamicFormField28: historyResp.dynamicFormField28,
          dynamicFormField29: historyResp.dynamicFormField29,
          dynamicFormField30: historyResp.dynamicFormField30,
          dynamicFormField31: historyResp.dynamicFormField31,
          dynamicFormField32: historyResp.dynamicFormField32,
          dynamicFormField33: historyResp.dynamicFormField33,
          dynamicFormField34: historyResp.dynamicFormField34,
          dynamicFormField35: historyResp.dynamicFormField35,
          dynamicFormField36: historyResp.dynamicFormField36,
          dynamicFormField37: historyResp.dynamicFormField37,
          dynamicFormField38: historyResp.dynamicFormField38,
          dynamicFormField39: historyResp.dynamicFormField39,
          dynamicFormField40: historyResp.dynamicFormField40,
          isTicketSource: historyResp.isTicketSource,
          ticketSourceHistoryId: historyResp.ticketSourceHistoryId,
          updatedBy: updatedBy,
          assigneeBranchCode: historyResp.assigneeBranchCode

        }
        await Ticket.update(ticketObj, { where: { id: ticketId } })
          .then(async (Ticres) => {
            await insertDateInTicketHistory(ticketId);
            //Fetch the userDetails4
            await Ticket.findOne({
              where: { id: ticketId }, include: [
                {
                  model: db.department,
                },
              ],
            })
              .then(async (ticResponse) => {
                await User.findOne({ where: { id: loggedInUserId } })
                  .then(async (userRes) => {
                    let msgBody = constants.lbl_TRANSFER_BACK_TICKET;
                    let EmailmapObj = {
                      "%{fullName}": userRes.fullName,
                      "%{departmentName}": ticResponse.department.departmentName,
                    };
                    msgBody = msgBody.replace(/%{fullName}|%{departmentName}|}/gi, function (matched) {
                      return EmailmapObj[matched];
                    });
                    let htmlMessage = msgBody;
                    await generalMethodsController.maintainTicketThread(userRes.fullName, null, htmlMessage, null, ticketId, null, null, true, false);
                    res.send({ status: "true" });
                  })
              })
              .catch((err) => {
                console.log(err);
              })
          })
          .catch((err) => {
            console.log(err);
            res.send("Some error occurred please contact administrator.");
          })
      })
      .catch((err) => {
        console.log(err);
        res.send("Some error occurred please contact administrator.");
      })
    console.log("*************************Transfer Back Ticket API Completed************************");
  } catch (exception) {
    console.log("*************************Transfer Back Ticket API Completed with Errors************************" + exception);
    res.send("Some error occurred please contact administrator.");
  }


} 