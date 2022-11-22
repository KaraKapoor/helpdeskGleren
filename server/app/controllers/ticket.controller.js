const db = require("../models");
const Ticket = db.ticket;
const TicketHistory = db.ticketHistory;
const EscalatedTickets = db.escalatedTickets;
const EmailTemplate = db.emailTemplate;
const User = db.user;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
const constants = require("../constants/constants");
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const larkIntegrationController = require("./larkIntegrationController.js");
var { htmlToText } = require('html-to-text');
const TicketReplies = db.ticketReplies;
const axios = require('axios');
require('dotenv').config();

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


exports.findAll = async (req, res) => {
  try {
    console.log("*************************Find All Tickets API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    await Ticket.findAll()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving.",
        });
      });
    console.log("*************************Find All Tickets API Completed************************");
  } catch (exception) {
    console.log("*************************Find All Tickets API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving.",
    });
  }

};
// 1:1
// Get the ticket linked to a given ticketSource
exports.findByUser = async (req, res) => {
  try {
    console.log("*************************Find Ticket By User Id API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    await Ticket.findAll({
      where: { userId: req.body.userId },
      include: [
        {
          model: db.user,
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
    console.log("*************************Find Ticket By User Id API Completed************************");
  } catch (exception) {
    console.log("*************************Find Ticket By User Id API Completed with Errors************************" + exception);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving.",
    });
  }

};

exports.create = async (req, res) => {
  try {
    console.log("*************************Create Ticket API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));

    let feedbacklinkId = uuidv4();
    let assigneeBranchCode = null;
    // Validate request
    if (!req.body.email) {
      res.status(400).send({
        message: "Email is mandatory",
      });
      return;
    }

    //Starts-Fetch the branch code of assignee
    await User.findOne({ where: { id: req.body.assigneeId } })
      .then((assigneeResp) => {
        assigneeBranchCode = assigneeResp.branch;
      })
    //Ends-Fetch the branch code of assignee

    let sendAlertToUser = req.body.ticketNotice;
    //Store the dynamic fields in separate columns
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
    let createdTicketId = 0;
    let ticketSubCategory = null;
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
    //End--Store the dynamic fields in separate columns 

    //Start-SlA

    let slaInMinutes = await generalMethodsController.calculateSLAMinutes(req.body.slaPlan);
    let level1SlaDueDate = await generalMethodsController.calculateSLATime(req.body.slaPlan);
    const ticket = {
      email: req.body.email,
      fullName: req.body.fullName,
      ticketNotice: req.body.ticketNotice,
      ticketSourceId: req.body.ticketSourceId,
      departmentId: req.body.departmentId,
      helpTopicId: req.body.helpTopicId,
      userId: req.body.userId,
      slaPlan: req.body.slaPlan,
      ticketStatus: req.body.ticketStatus,
      assigneeId: req.body.assigneeId,
      assigneeFullName: req.body.assigneeFullName,
      branch: req.body.branch,
      schCol: req.body.schCol,
      ticketCategory: req.body.ticketCategory,
      dynamicFormJson: req.body.dynamicFormJson,
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
      slaPlanInMinutes: slaInMinutes,
      level1SlaDue: level1SlaDueDate,
      employeeNo: req.body.employeeNo,
      openDepartmentIdOfUser: req.body.openDepartmentIdOfUser,
      feedbacklinkId: feedbacklinkId,
      assigneeBranchCode: assigneeBranchCode,
      updatedBy: req.body.userId,
      initialCreatedDate: new Date(),
      createdBy: req.body.createdBy,
      ticketSubCategory: ticketSubCategory,
      nspiraCode: req.body.nspiraCode,
      payrollCode: req.body.payrollCode,
      state: req.body.state,
      district: req.body.district
    };
    const ticketHistory = {
      ticketId: createdTicketId,
      email: req.body.email,
      fullName: req.body.fullName,
      ticketNotice: req.body.ticketNotice,
      ticketSourceId: req.body.ticketSourceId,
      departmentId: req.body.departmentId,
      helpTopicId: req.body.helpTopicId,
      userId: req.body.userId,
      slaPlan: req.body.slaPlan,
      ticketStatus: req.body.ticketStatus,
      assigneeId: req.body.assigneeId,
      assigneeFullName: req.body.assigneeFullName,
      branch: req.body.branch,
      schCol: req.body.schCol,
      ticketCategory: req.body.ticketCategory,
      dynamicFormJson: req.body.dynamicFormJson,
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
      slaPlanInMinutes: slaInMinutes,
      level1SlaDue: level1SlaDueDate,
      employeeNo: req.body.employeeNo,
      openDepartmentIdOfUser: req.body.openDepartmentIdOfUser,
      feedbacklinkId: feedbacklinkId,
      assigneeBranchCode: assigneeBranchCode,
      updatedBy: req.body.userId,
      initialCreatedDate: new Date(),
      createdBy: req.body.createdBy,
      ticketSubCategory: ticketSubCategory,
      nspiraCode: req.body.nspiraCode,
      payrollCode: req.body.payrollCode,
      state: req.body.state,
      district: req.body.district
    };

    await Ticket.create(ticket)
      .then(async (data) => {

        if (data.id) {

          //Starts-Maintain Ticket Thread
          if (req.body.isTicketCreatedOnBehalfOFAnotherPerson === true) {
            let msgBody = constants.lbl_CREATE_TICKET_ON_BEHALF;
            let EmailmapObj = {
              "%{fullName}": req.body.originalTicketCreator,
              "%{behalfPersonName}": req.body.fullName,
            };
            msgBody = msgBody.replace(/%{fullName}|%{behalfPersonName}|}/gi, function (matched) {
              return EmailmapObj[matched];
            });
            let htmlMessage = msgBody;
            await generalMethodsController.maintainTicketThread(req.body.email, null, htmlMessage, null, data.id, null, null, true);

            //Add thread for first time assignee
            let msg = constants.lbl_ASSIGN_TICKET;
            let EmailmapObj1 = {
              "%{fullName}": "System",
              "%{assigneeName}": req.body.assigneeFullName,
            };
            msg = msg.replace(/%{fullName}|%{assigneeName}|}/gi, function (matched) {
              return EmailmapObj1[matched];
            });
            let htmlMessage1 = msg;
            await generalMethodsController.maintainTicketThread(req.body.email, null, htmlMessage1, null, data.id, null, null, true, false);
          }
          if (req.body.isTicketCreatedOnBehalfOFAnotherPerson === false) {
            let msgBody = constants.lbl_CREATE_TICKET;
            let EmailmapObj = {
              "%{fullName}": req.body.fullName,
            };
            msgBody = msgBody.replace(/%{fullName}|}/gi, function (matched) {
              return EmailmapObj[matched];
            });
            let htmlMessage = msgBody;
            await generalMethodsController.maintainTicketThread(req.body.email, null, htmlMessage, null, data.id, null, null, true, false);
            //Add thread for first time assignee
            let msg = constants.lbl_ASSIGN_TICKET;
            let EmailmapObj1 = {
              "%{fullName}": "System",
              "%{assigneeName}": req.body.assigneeFullName,
            };
            msg = msg.replace(/%{fullName}|%{assigneeName}|}/gi, function (matched) {
              return EmailmapObj1[matched];
            });
            let htmlMessage1 = msg;
            await generalMethodsController.maintainTicketThread(req.body.email, null, htmlMessage1, null, data.id, null, null, true, false);
          }

          //End Maintain Ticket Thread
          /* Fetch the created ticket details*/
          await Ticket.findByPk(data.id, {
            include: [
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
            .then(async createdTicketData => {
              console.log(createdTicketData);

              let baseUrl = process.env.BASE_URL;
              var ticketNumber = createdTicketData.id;
              var fullName = createdTicketData.fullName;
              var ticketSubject = "";
              var ticketDetails = "";
              var departmentName = createdTicketData.department.departmentName;
              var helpTopicName = createdTicketData.helptopic.helpTopicName;
              var viewTicketLink = baseUrl + constants.VIEW_TICKET + ticketNumber;
              var emailTo = createdTicketData.email;
              for (let i of Object.entries(createdTicketData.dynamicFormJson)) {
                let processString = i[0].toString().toLowerCase().replace(/_/g, "")
                if (processString.includes("issuesummary")) {
                  ticketSubject = i[1];
                }
                if (processString.includes("issuedetails")) {
                  ticketDetails = i[1];
                }
              }

              //Start--Send Lark Alert
              const larkAlertResp = await larkIntegrationController.createLarkAlerts(createdTicketData.user.openId, createdTicketData.id, ticketSubject, ticketDetails, createdTicketData.department.departmentName, createdTicketData.helptopic.helpTopicName, createdTicketData.user.fullName, createdTicketData.initialCreatedDate, createdTicketData.assigneeFullName, constants.lbl_ALERT_TYPE_OPENED, createdTicketData.ticketStatus);
              //End--Send Lark Alert
              /*Starts- Email Template Processing */

              await EmailTemplate.findByPk(constants.CREATE_TICKET_TEMPLATE_ID)
                .then(async data => {
                  var emailSubject = data.subject;
                  var emailBody = data.emailBody;
                  var EmailmapObj = {
                    "%{recipient.name}": fullName,
                    "%{ticket.number}": ticketNumber,
                    "%{ticket.dept.name}": departmentName,
                    "%{ticket.name}": ticketSubject,
                    "%{ticket.topic.name}": helpTopicName,
                    "%{ticket.thread.original}": ticketDetails,
                    "%%7Bticket.staff_link%7D": viewTicketLink,
                    "%{ticket.subject}": ticketSubject
                  };
                  emailBody = emailBody.replace(/%{recipient.name}|%{ticket.number}|%{ticket.dept.name}|%{ticket.name}|%{ticket.topic.name}|%{ticket.thread.original}|%%7Bticket.staff_link%7D|%{ticket.subject}/gi, function (matched) {
                    return EmailmapObj[matched];
                  });
                  const transporter = generalMethodsController.getEmailTransporter();
                  const settingsResponse = await tenantCoreSettingsController.getSettingsByTenantName();

                  var mailOptions = {
                    from: settingsResponse.dataValues.smtp_email,
                    to: emailTo,
                    subject: emailSubject,
                    text: htmlToText(emailBody)
                  };

                  //send email only when sendTicketNotice is true.

                  if (sendAlertToUser === true) {
                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });
                  }

                })
                .catch(err => {
                  res.status(200).send({
                    message: "Error retrieving Email Template with id=" + 8
                  });
                });

            })
            .catch(err => {
              res.status(200).send({
                message: err.message || "Some error occurred while creating."
              });
            });

          /*Starts-Save ticket data to ticket history table*/
          ticketHistory.ticketId = data.id,
            await TicketHistory.create(ticketHistory)
              .then((data1) => {
                res.send(data);  //send ticket created data.
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while creating.",
                });
              });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: err.message || "Some error occurred while creating.",
        });
      });

    console.log("*************************Create Ticket API Completed************************");
  } catch (exception) {
    console.log("*************************Create Ticket API Completed with Errors************************" + exception);
    res.status(500).send({
      message:  "Some error occurred while creating.",
    });
  }

};

exports.bulkUpdateTicketStatus = async (req, res) => {
  try {
    console.log("*************************Bulk Update Ticket Status API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));

    const idArray = req.body.id;
    const idNotFoundArray = []
    const idFoundArray = [];
    let TicketClosedDate = null;
    let TicketClosedBy = null;
    let closedById = null;
    const userId = req.body.userId;
    let userEmail = undefined;
    // const userMobile =req.body.userMobile;
    let fullName = null;
    let updatedBy = null;
    let emailsInvolvedInTicket = null;

    //Fetch the userDetails
    await User.findOne({ where: { id: userId } })
      .then((userRes) => {
        if (userRes === null) {
          return res.status(200).send({
            success: false,
            message: "LoggedIn user email details not found please contact administrator " + userEmail
          });
        }
        fullName = userRes.fullName;
        updatedBy = userRes.id;
        userEmail = userRes.email;
      })

    for (var id of idArray) {
      await Ticket.findByPk(id)
        .then(data => {
          if (data == null || data == "") {
            idNotFoundArray.push(id);
          }
          if (data) {
            idFoundArray.push(id);
          }

        })
        .catch(err => {
          res.status(500).send({
            message: "Error retrieving Ticket with id=" + id
          });
        });

    }
    if (idFoundArray.length <= 0) {
      res.status(200).send({
        message: "Error retrieving Ticket with id=" + id
      });
    }
    // Case to update the ticketStatus
    if (req.body.ticketStatus && req.body.ticketStatus !== "" && req.body.ticketStatus !== undefined) {
      if (req.body.ticketStatus.includes("Closed")) {
        TicketClosedDate = new Date().toISOString();
        TicketClosedBy = fullName;
        closedById = updatedBy;//Same id of person who updated it and closes it.
      } else {
        TicketClosedDate = null;
        TicketClosedBy = null;
        closedById = null;
      }
      for (var foundedId of idFoundArray) {

        //Check for previous ticket status.
        if (!req.body.ticketStatus.includes("Closed")) {
          await Ticket.findByPk(foundedId, {
            include: [
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
            .then(async (tickResp) => {
              let ticketSubject = await generalMethodsController.getKeyFromDynamicFormJson(tickResp.dynamicFormJson, 'issuesummary');
              let ticketDetails = await generalMethodsController.getKeyFromDynamicFormJson(tickResp.dynamicFormJson, 'issuedetails');


              if (tickResp.ticketStatus === "Closed") {
                //Start--Send Lark Alert
                const ticketAssigneeDetails = await User.findByPk(tickResp.assigneeId);
                const larkAlertRespUser = await larkIntegrationController.createLarkAlerts(tickResp.user.openId, tickResp.id, ticketSubject, ticketDetails, tickResp.department.departmentName, tickResp.helptopic.helpTopicName, tickResp.user.fullName, tickResp.initialCreatedDate, tickResp.assigneeFullName, constants.lbl_ALERT_TYPE_REOPENED, tickResp.ticketStatus);
                const larkAlertRespAssignee = await larkIntegrationController.createLarkAlerts(ticketAssigneeDetails.openId, tickResp.id, ticketSubject, ticketDetails, tickResp.department.departmentName, tickResp.helptopic.helpTopicName, tickResp.user.fullName, tickResp.initialCreatedDate, tickResp.assigneeFullName, constants.lbl_ALERT_TYPE_REOPENED, tickResp.ticketStatus);
                //End--Send Lark Alert
                let reopenCount = tickResp.reopenThreadCount + 1;

                //If previous ticket status was closed then increase the reopen count of the ticket and assign it to the person who has previously closed it.
                await User.findByPk(tickResp.closedById).
                  then(async (newAssigneeResp) => {
                    //Start-In Case if ticket is closed user itself then as per the requirement assign to L1 assignee and in all cases reset the SLA triggers and created date of ticket.
                    if (newAssigneeResp.isAgent === null || newAssigneeResp.isAgent === false || newAssigneeResp.isAgent === '') {
                      console.log("Previous CLOSED BY USER");
                      //Fetch the L1 assignee details based on ticket details
                      if (constants.COLLEGE_TYPES.includes(tickResp.schCol.toLowerCase())) {
                        await axios.post(constants.baseUrl + "api/collegeEscalation/getCollegeEscalationAssignee", { "department": tickResp.department.departmentName, "module": tickResp.helptopic.module, "openDepartmentId": tickResp.user.openDepartmentId })
                          .then(async (escalationResp) => {
                            console.log(escalationResp.data.l1email);
                            await axios.get(constants.baseUrl + "api/user/getUserByEmail", { params: { email: escalationResp.data.l1email } })
                              .then(async (assigneeResp) => {
                                console.log(assigneeResp.data.email);
                                //Check if modified SLA plan is present
                                let slaInMinutes;
                                let slaTimeResp;
                                if (tickResp.modifiedSlaPlan) {
                                  slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.modifiedSlaPlan);
                                  slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.modifiedSlaPlan);
                                } else {
                                  slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.slaPlan);
                                  slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.slaPlan);
                                }

                                console.log(slaTimeResp);
                                await Ticket.update({
                                  assigneeFullName: assigneeResp.data.fullName,
                                  assigneeId: assigneeResp.data.id,//Assign to the person who has closed ticket
                                  ticketStatus: req.body.ticketStatus,
                                  closedDate: TicketClosedDate,
                                  closedById: closedById,
                                  reopenThreadCount: reopenCount,
                                  closedBy: TicketClosedBy,
                                  updatedBy: updatedBy,
                                  createdAt: new Date(),
                                  slaPlanInMinutes: slaInMinutes,
                                  level1SlaDue: slaTimeResp,
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
                                  isTicketOverdue: null

                                },
                                  { where: { id: foundedId } })
                                  .then(async (res) => {
                                    if (res) {
                                      //Start-Maintain Ticket thread.
                                      let msgBody = constants.lbl_REOPEN_TICKET;
                                      let EmailmapObj = {
                                        "%{fullName}": fullName
                                      };
                                      msgBody = msgBody.replace(/%{fullName}|}/gi, function (matched) {
                                        return EmailmapObj[matched];
                                      });
                                      let htmlMessage = msgBody;
                                      const ticketReplies = {
                                        repliedby: fullName,
                                        ticketId: foundedId,
                                        message: htmlMessage,
                                        isTicketActivityThread: true,
                                        usedInCannedFilters: false
                                      };

                                      await TicketReplies.create(ticketReplies)
                                        .then(async (res) => {
                                          console.log("Thread updated");
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                        })
                                      await generalMethodsController.insertDateInTicketHistory(foundedId);
                                      //End-Maintain Ticket thread.
                                    }
                                  })
                              })
                              .catch((err) => {
                                console.log(err);
                              })
                          })
                          .catch((err) => {
                            console.log(err);
                          })
                      } else if (constants.ADMIN_TYPES.includes(tickResp.schCol.toLowerCase())) {
                        await axios.post(constants.baseUrl + "api/administrativeEscalation/getAdministrativeEscalationAssignee", { "department": tickResp.department.departmentName, "module": tickResp.helptopic.module, "openDepartmentId": tickResp.user.openDepartmentId })
                          .then(async (escalationResp) => {
                            console.log(escalationResp.data.l1email);
                            await axios.get(constants.baseUrl + "api/user/getUserByEmail", { params: { email: escalationResp.data.l1email } })
                              .then(async (assigneeResp) => {
                                console.log(assigneeResp.data.email);
                                //Check if modified SLA plan is present
                                let slaInMinutes;
                                let slaTimeResp;
                                if (tickResp.modifiedSlaPlan) {
                                  slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.modifiedSlaPlan);
                                  slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.modifiedSlaPlan);
                                } else {
                                  slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.slaPlan);
                                  slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.slaPlan);
                                }

                                console.log(slaTimeResp);
                                await Ticket.update({
                                  assigneeFullName: assigneeResp.data.fullName,
                                  assigneeId: assigneeResp.data.id,//Assign to the person who has closed ticket
                                  ticketStatus: req.body.ticketStatus,
                                  slaPlanInMinutes: slaInMinutes,
                                  closedDate: TicketClosedDate,
                                  reopenThreadCount: reopenCount,
                                  closedBy: TicketClosedBy,
                                  closedById: closedById,
                                  updatedBy: updatedBy,
                                  createdAt: new Date(),
                                  level1SlaDue: slaTimeResp,
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
                                  isTicketOverdue: null

                                },
                                  { where: { id: foundedId } })
                                  .then(async (res) => {
                                    if (res) {
                                      //Start-Maintain Ticket thread.
                                      let msgBody = constants.lbl_REOPEN_TICKET;
                                      let EmailmapObj = {
                                        "%{fullName}": fullName
                                      };
                                      msgBody = msgBody.replace(/%{fullName}|}/gi, function (matched) {
                                        return EmailmapObj[matched];
                                      });
                                      let htmlMessage = msgBody;
                                      const ticketReplies = {
                                        repliedby: fullName,
                                        ticketId: foundedId,
                                        message: htmlMessage,
                                        isTicketActivityThread: true,
                                        usedInCannedFilters: false
                                      };

                                      await TicketReplies.create(ticketReplies)
                                        .then(async (res) => {
                                          console.log("Thread updated");
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                        })
                                      await generalMethodsController.insertDateInTicketHistory(foundedId);
                                      //End-Maintain Ticket thread.
                                    }
                                  })
                              })
                              .catch((err) => {
                                console.log(err);
                              })
                          })
                          .catch((err) => {
                            console.log(err);
                          })
                      } else if (constants.SCHOOL_TYPES.includes(tickResp.schCol.toLowerCase())) {
                        await axios.post(constants.baseUrl + "api/schoolEscalation/getSchoolEscalationAssignee", { "department": tickResp.department.departmentName, "module": tickResp.helptopic.module, "openDepartmentId": tickResp.user.openDepartmentId })
                          .then(async (escalationResp) => {
                            console.log(escalationResp.data.l1email);
                            await axios.get(constants.baseUrl + "api/user/getUserByEmail", { params: { email: escalationResp.data.l1email } })
                              .then(async (assigneeResp) => {
                                console.log(assigneeResp.data.email);
                                //Check if modified SLA plan is present
                                let slaInMinutes;
                                let slaTimeResp;
                                if (tickResp.modifiedSlaPlan) {
                                  slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.modifiedSlaPlan);
                                  slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.modifiedSlaPlan);
                                } else {
                                  slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.slaPlan);
                                  slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.slaPlan);
                                }
                                console.log(slaTimeResp);
                                await Ticket.update({
                                  assigneeFullName: assigneeResp.data.fullName,
                                  assigneeId: assigneeResp.data.id,//Assign to the person who has closed ticket
                                  ticketStatus: req.body.ticketStatus,
                                  closedDate: TicketClosedDate,
                                  reopenThreadCount: reopenCount,
                                  closedBy: TicketClosedBy,
                                  closedById: closedById,
                                  updatedBy: updatedBy,
                                  createdAt: new Date(),
                                  slaPlanInMinutes: slaInMinutes,
                                  level1SlaDue: slaTimeResp,
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
                                  isTicketOverdue: null

                                },
                                  { where: { id: foundedId } })
                                  .then(async (res) => {
                                    if (res) {
                                      //Start-Maintain Ticket thread.
                                      let msgBody = constants.lbl_REOPEN_TICKET;
                                      let EmailmapObj = {
                                        "%{fullName}": fullName
                                      };
                                      msgBody = msgBody.replace(/%{fullName}|}/gi, function (matched) {
                                        return EmailmapObj[matched];
                                      });
                                      let htmlMessage = msgBody;
                                      const ticketReplies = {
                                        repliedby: fullName,
                                        ticketId: foundedId,
                                        message: htmlMessage,
                                        isTicketActivityThread: true,
                                        usedInCannedFilters: false
                                      };

                                      await TicketReplies.create(ticketReplies)
                                        .then(async (res) => {
                                          console.log("Thread updated");
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                        })
                                      await generalMethodsController.insertDateInTicketHistory(foundedId);
                                      //End-Maintain Ticket thread.
                                    }
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
                    } else {
                      //Else if agent assigned to the person who closes it.
                      console.log("Previous CLOSED BY AGENT");
                      //Check if modified SLA plan is present
                      let slaInMinutes;
                      let slaTimeResp;
                      if (tickResp.modifiedSlaPlan) {
                        slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.modifiedSlaPlan);
                        slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.modifiedSlaPlan);
                      } else {
                        slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.slaPlan);
                        slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.slaPlan);
                      }
                      await Ticket.update({
                        assigneeFullName: newAssigneeResp.fullName,
                        assigneeId: newAssigneeResp.id,//Assign to the person who has closed ticket
                        ticketStatus: req.body.ticketStatus,
                        closedDate: TicketClosedDate,
                        reopenThreadCount: reopenCount,
                        closedBy: TicketClosedBy,
                        closedById: closedById,
                        updatedBy: updatedBy,
                        createdAt: new Date(),
                        slaPlanInMinutes: slaInMinutes,
                        level1SlaDue: slaTimeResp,
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
                        isTicketOverdue: null

                      },
                        { where: { id: foundedId } })
                        .then(async (res) => {
                          if (res) {
                            //Start-Maintain Ticket thread.
                            let msgBody = constants.lbl_REOPEN_TICKET;
                            let EmailmapObj = {
                              "%{fullName}": fullName
                            };
                            msgBody = msgBody.replace(/%{fullName}|}/gi, function (matched) {
                              return EmailmapObj[matched];
                            });
                            let htmlMessage = msgBody;
                            const ticketReplies = {
                              repliedby: fullName,
                              ticketId: foundedId,
                              message: htmlMessage,
                              isTicketActivityThread: true,
                              usedInCannedFilters: false
                            };

                            await TicketReplies.create(ticketReplies)
                              .then(async (res) => {
                                console.log("Thread updated");
                              })
                              .catch((err) => {
                                console.log(err);
                              })
                            await generalMethodsController.insertDateInTicketHistory(foundedId);
                            //End-Maintain Ticket thread.
                          }
                        })

                    }
                    //End-In Case if ticket is closed user itself then as per the requirement assign to L1 assignee and in all cases reset the SLA triggers and created date of ticket.

                  })
              } else {
                //Start--Send Lark Alert
                const larkAlertResp = await larkIntegrationController.createLarkAlerts(tickResp.user.openId, tickResp.id, ticketSubject, ticketDetails, tickResp.department.departmentName, tickResp.helptopic.helpTopicName, tickResp.user.fullName, tickResp.initialCreatedDate, tickResp.assigneeFullName, constants.lbl_ALERT_TYPE_STATUS_CHANGED, tickResp.ticketStatus);
                //End--Send Lark Alert
                await Ticket.update({
                  ticketStatus: req.body.ticketStatus,
                  closedDate: TicketClosedDate,
                  isTicketActivityThread: true,
                  closedBy: TicketClosedBy,
                  closedById: closedById,
                  updatedBy: updatedBy
                },
                  { where: { id: foundedId } })
                  .then(async (res) => {
                    if (res) {
                      //Start-Maintain Ticket thread.
                      let msgBody = constants.lbl_CHANGE_STATUS_TICKET;
                      let EmailmapObj = {
                        "%{fullName}": fullName ||'',
                        "%{statusName}": req.body.ticketStatus
                      };
                      msgBody = msgBody.replace(/%{fullName}|%{statusName}|}/gi, function (matched) {
                        return EmailmapObj[matched];
                      });
                      let htmlMessage = msgBody;
                      const ticketReplies = {
                        repliedby: fullName,
                        ticketId: foundedId,
                        message: htmlMessage,
                        isTicketActivityThread: true
                      };

                      await TicketReplies.create(ticketReplies)
                        .then(async (res) => {
                          console.log("Thread updated");
                        })
                        .catch((err) => {
                          console.log(err);
                        })
                      await generalMethodsController.insertDateInTicketHistory(foundedId);
                      //End-Maintain Ticket thread.
                    }
                  })
              }
            })
        } else {
          await Ticket.findByPk(foundedId, {
            include: [
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
            .then(async (tickResp) => {
              const ticketAssigneeDetails = await User.findByPk(tickResp.assigneeId);
              let ticketSubject = await generalMethodsController.getKeyFromDynamicFormJson(tickResp.dynamicFormJson, 'issuesummary');
              let ticketDetails = await generalMethodsController.getKeyFromDynamicFormJson(tickResp.dynamicFormJson, 'issuedetails');
              const larkAlertRespUser = await larkIntegrationController.createLarkAlerts(tickResp.user.openId, tickResp.id, ticketSubject, ticketDetails, tickResp.department.departmentName, tickResp.helptopic.helpTopicName, tickResp.user.fullName, tickResp.initialCreatedDate, tickResp.assigneeFullName, constants.lbl_ALERT_TYPE_CLOSED, tickResp.ticketStatus);
              const larkAlertRespAssignee = await larkIntegrationController.createLarkAlerts(ticketAssigneeDetails.openId, tickResp.id, ticketSubject, ticketDetails, tickResp.department.departmentName, tickResp.helptopic.helpTopicName, tickResp.user.fullName, tickResp.initialCreatedDate, tickResp.assigneeFullName, constants.lbl_ALERT_TYPE_CLOSED, tickResp.ticketStatus);
            })

          await Ticket.update({
            ticketStatus: req.body.ticketStatus,
            closedDate: TicketClosedDate,
            isTicketActivityThread: true,
            closedBy: TicketClosedBy,
            updatedBy: updatedBy,
            closedById: closedById
          },
            { where: { id: foundedId } })
            .then(async (res) => {
              if (res) {
                //Start-Maintain Ticket thread.
                let msgBody = constants.lbl_CHANGE_STATUS_TICKET;
                let EmailmapObj = {
                  "%{fullName}": fullName,
                  "%{statusName}": req.body.ticketStatus,

                };
                msgBody = msgBody.replace(/%{fullName}|%{statusName}|}/gi, function (matched) {
                  return EmailmapObj[matched];
                });
                let htmlMessage = msgBody;
                const ticketReplies = {
                  repliedby: fullName,
                  ticketId: foundedId,
                  message: htmlMessage,
                  isTicketActivityThread: true
                };

                await TicketReplies.create(ticketReplies)
                  .then(async (res) => {
                    console.log("Thread updated");
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                await generalMethodsController.insertDateInTicketHistory(foundedId);
                //End-Maintain Ticket thread.
              }
            })
        }
      }
      console.log("Status case");
      // res.status(200).send({
      //   message: 'Data Update Successfully'
      // });
    }

    // Case to update the assignee
    if (req.body.assigneeId && req.body.assigneeId !== "" && req.body.assigneeId !== undefined && req.body.assigneeFullName && req.body.assigneeFullName !== "" && req.body.assigneeFullName !== undefined) {
      console.log("Assignee case");
      const assigneeName= await generalMethodsController.splitStringFromCharacter(req.body.assigneeFullName,"<",false);
      for (var foundedId of idFoundArray) {
        emailsInvolvedInTicket = null;
        await Ticket.findByPk(id, {
          include: [
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
          .then(async (resp) => {
            //Start--Send Lark Alert
            let ticketSubject = await generalMethodsController.getKeyFromDynamicFormJson(resp.dynamicFormJson, 'issuesummary');
            let ticketDetails = await generalMethodsController.getKeyFromDynamicFormJson(resp.dynamicFormJson, 'issuedetails');
            const assigneeDetails = await User.findByPk(resp.assigneeId);
            const larkAlertResp = await larkIntegrationController.createLarkAlerts(assigneeDetails.openId, resp.id, ticketSubject, ticketDetails, resp.department.departmentName, resp.helptopic.helpTopicName, resp.user.fullName, resp.initialCreatedDate, resp.assigneeFullName, constants.lbl_ALERT_TYPE_ASSIGNED, resp.ticketStatus);
            //End--Send Lark Alert
            let previousPresentEmails = null;
            if (resp.emailsInvolvedInTicket !== null) {
              previousPresentEmails = resp.emailsInvolvedInTicket;
            }
            await User.findByPk(req.body.assigneeId)
              .then(async (userResp) => {
                if (previousPresentEmails !== null) {
                  emailsInvolvedInTicket = previousPresentEmails + ',' + userResp.email;
                } else {
                  emailsInvolvedInTicket = userResp.email;
                }

                await Ticket.update({
                  assigneeId: req.body.assigneeId,
                  assigneeFullName: assigneeName,
                  updatedBy: updatedBy,
                  emailsInvolvedInTicket: emailsInvolvedInTicket
                },
                  { where: { id: foundedId } })
                  .then(async data => {
                    if (foundedId) {
                      await generalMethodsController.insertDateInTicketHistory(foundedId);
                      //Start-Maintain Ticket thread.
                      let msgBody = constants.lbl_ASSIGN_TICKET;
                      let mapObj = {
                        "%{fullName}": fullName,
                        "%{assigneeName}": assigneeName
                      }
                      msgBody = msgBody.replace(/%{fullName}|%{assigneeName}|}/gi, function (matched) {
                        return mapObj[matched];
                      });
                      let htmlMessage = msgBody;
                      const ticketReplies = {
                        repliedby: userEmail,
                        ticketId: foundedId,
                        message: htmlMessage,
                        isTicketActivityThread: true,
                        usedInCannedFilters: false
                      };

                      await TicketReplies.create(ticketReplies)
                        .then(async (res) => {
                          console.log("Thread updated");
                        })
                        .catch((err) => {
                          console.log(err);
                        })

                      //End-Maintain Ticket thread.

                      /* Fetch the ticket details*/
                      await Ticket.findByPk(foundedId, {
                        include: [
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
                        .then(async createdTicketData => {
                          //Start--Send Lark Alert
                          let ticketSubject = await generalMethodsController.getKeyFromDynamicFormJson(createdTicketData.dynamicFormJson, 'issuesummary');
                          let ticketDetails = await generalMethodsController.getKeyFromDynamicFormJson(createdTicketData.dynamicFormJson, 'issuedetails');
                          const assigneeDetails = await User.findByPk(createdTicketData.assigneeId);
                          const larkAlertResp = await larkIntegrationController.createLarkAlerts(assigneeDetails.openId, createdTicketData.id, ticketSubject, ticketDetails, createdTicketData.department.departmentName, createdTicketData.helptopic.helpTopicName, createdTicketData.user.fullName, createdTicketData.initialCreatedDate, createdTicketData.assigneeFullName, constants.lbl_ALERT_TYPE_ASSIGNED, createdTicketData.ticketStatus);
                          //End--Send Lark Alert
                          let baseUrl = process.env.BASE_URL;
                          var assigneeFullName = createdTicketData.assigneeFullName;
                          var ticketNumber = createdTicketData.id;
                          var assigner = createdTicketData.fullName;
                          var helpTopicName = createdTicketData.helptopic.helpTopicName;
                          var viewTicketLink = baseUrl + constants.VIEW_TICKET + ticketNumber;
                          var assigneeEmailTo = "";
                          await User.findByPk(createdTicketData.assigneeId)
                            .then(async res => {
                              assigneeEmailTo = res.email;

                              /*Starts- Email Template Processing */
                              await EmailTemplate.findByPk(constants.ASSIGNEE_TICKET_TEMPLATE_ID)
                                .then(async data => {
                                  var emailSubject = data.subject;
                                  var emailBody = data.emailBody;
                                  var EmailmapObj = {
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
                                  const transporter = generalMethodsController.getEmailTransporter();
                                  const settingsResponse = await tenantCoreSettingsController.getSettingsByTenantName();

                                  var mailOptions = {
                                    from: settingsResponse.dataValues.smtp_email,
                                    to: assigneeEmailTo,
                                    subject: emailSubject,
                                    text: htmlToText(emailBody)
                                  };
                                  transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log('Email sent: ' + info.response);

                                    }
                                  });
                                })
                                .catch(err => {
                                  res.status(200).send({
                                    message: "Error retrieving Email Template with id=" + 11
                                  });
                                });

                            })
                            .catch(err => {
                              res.status(200).send({
                                message: "Error retrieving User id=" + createdTicketData.assigneeId
                              });
                            });


                        })
                        .catch(err => {
                          res.status(200).send({
                            message: err.message || "Some error occurred while creating."
                          });
                        });
                    }
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
      // res.status(200).send({
      //   message: 'Data Update Successfully'
      // });
    }

    // Case to update the ticket subcategory

    if (req.body.ticketSubCategory && req.body.ticketSubCategory !== "" && req.body.ticketSubCategory !== undefined) {
      for (var foundedId of idFoundArray) {
        console.log(foundedId);
        await Ticket.update({ ticketSubCategory: req.body.ticketSubCategory }, { where: { id: foundedId } });
        //Start-Maintain Ticket thread.
        let msgBody = constants.lbl_SUBCATEGORY_CHANGE_TICKET;
        let EmailmapObj = {
          "%{fullName}": fullName,
          "%{categoryName}": req.body.ticketSubCategory
        };
        msgBody = msgBody.replace(/%{fullName}|%{categoryName}|}/gi, function (matched) {
          return EmailmapObj[matched];
        });
        let htmlMessage = msgBody;
        await generalMethodsController.maintainTicketThread(fullName, null, htmlMessage, null, foundedId, null, null, 1, null);
      }
    }

    res.status(200).send({
      message: 'Data Update Successfully'
    });

    console.log("*************************Bulk Update Ticket Status API Completed************************");
  } catch (exception) {
    console.log("*************************Bulk Update Ticket Status API Completed with Errors************************" + exception);
  }
}

exports.findAllTicketsWithPagination = async (req, res) => {
  try {
    console.log("*************************Find All Tickets With Pagination API Started************************");
    console.log("INPUT" + JSON.stringify(req.query));

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const queryParam = req.query.searchParam;
    const userId = req.query.userId;
    let ticketStatus = req.query.ticketStatus;
    const departmentId = req.query.departmentId;
    let isTicketOverdue = req.query.isTicketOverdue;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let closedStartDate = req.query.closedStartDate;
    let closedEndDate = req.query.closedEndDate;
    let nonEmptyKeys = [];
    let createdDates = { createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } };
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let sortColumns;
    if (orderBy !== undefined && orderBy !== "undefined") {
      if (orderBy === 'subject') {
        sortColumns = ['dynamicFormJson', orderDirection];
      } else if (orderBy === 'userMobile') {
        sortColumns = ['fullName', orderDirection];
      } else if (orderBy === 'departmentName') {
        sortColumns = ['departmentId', orderDirection];
      } else if (orderBy === 'level1DueDate') {
        sortColumns = ['level1SlaDue', orderDirection];
      }
      else {
        sortColumns = [orderBy, orderDirection];
      }

    } else {
      sortColumns = ['updatedAt', 'DESC'];
    }
    nonEmptyKeys.push(createdDates);

    if (departmentId !== "undefined" && departmentId !== "" & departmentId !== null) {
      let departJson = { "departmentId": departmentId };
      nonEmptyKeys.push(departJson);
    }
    if (ticketStatus !== '' && ticketStatus !== 'All') {
      // let statusJson = { "ticketStatus": ticketStatus };
      // nonEmptyKeys.push(statusJson);
      const status = ticketStatus.split(",");
      let statusJson = { ticketStatus: { [Op.in]: status } };
      nonEmptyKeys.push(statusJson);
    }
    if (isTicketOverdue === 'Yes') {
      let overdueJson = { "isTicketOverdue": isTicketOverdue };
      nonEmptyKeys.push(overdueJson);
    } else if (isTicketOverdue === 'No') {
      let overdueJson = { "isTicketOverdue": null };
      nonEmptyKeys.push(overdueJson);
    }

    if (closedStartDate !== "undefined" && closedEndDate !== "undefined") {
      let closedDates = { closedDate: { [Op.between]: [`${closedStartDate}`, `${closedEndDate}`] } };
      nonEmptyKeys.push(closedDates);
    }

    var condition = { [Op.or]: [{ assigneeId: `${userId}` }, { userId: `${userId}` }], [Op.and]: nonEmptyKeys }

    /*Start- Prepare condition set based on userInput */
    //Start-Condition One- (Search Param Only)
    if (queryParam !== "" && queryParam !== null) {
      var condition = { [Op.or]: [{ assigneeId: `${userId}` }, { userId: `${userId}` }], [Op.and]: [{ [Op.or]: [{ id: `${queryParam}` }, { '$user.mobile$': `${queryParam}` }] }] }
    }
    //End- Condtion One

    // Ticket.findAndCountAll({
    //   limit, offset, where: { [Op.or]: [{ assigneeFullName: `${queryParam}` }, { assigneeId: `${userId}` }, { userId: `${userId}` }, { id: `${queryParam}` }], [Op.and]: [{ ticketStatus: `${ticketStatus}` }] }, order: [['createdAt', 'DESC'],],
    // })
    await Ticket.findAndCountAll({
      limit, offset, where: condition, include: [
        {
          model: db.department,
        },
        {
          model: db.user,
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

    console.log("*************************Find All Tickets With Pagination API Completed************************");
  } catch (exception) {
    console.log("*************************Find All Tickets With Pagination API Completed with Errors************************" + exception);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tickets."
    });
  }

}

exports.getTicketByTicketId = async (req, res) => {
  try {
    console.log("*************************Find Ticket By Id API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    const id = req.body.id;
    await Ticket.findByPk(id, {
      include: [
        {
          model: db.user
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
      ],
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Ticket with id=" + id
        });
      });
    console.log("*************************Find Ticket By Id API Completed************************");
  } catch (exception) {
    console.log("*************************Find Ticket By Id API Completed with Errors************************" + exception);
    res.status(500).send({
      message: "Error retrieving Ticket with id=" + id
    });
  }

}
exports.updateAssignee = async (req, res) => {
  try {
    console.log("*************************Update Assignee API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    if (req.body.assigneeId && req.body.assigneeFullName) {
      await Ticket.update({
        assigneeId: req.body.assigneeId,
        assigneeFullName: req.body.assigneeFullName
      },
        { where: { id: req.body.ticketId } })
        .then(async data => {
          /* Fetch the ticket details*/
          await Ticket.findByPk(req.body.ticketId, {
            include: [
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
            .then(async createdTicketData => {
              let baseUrl = process.env.BASE_URL;
              var assigneeFullName = createdTicketData.assigneeFullName;
              var ticketNumber = createdTicketData.id;
              var assigner = createdTicketData.fullName;
              var ticketSubject = "";
              var ticketDetails = "";
              var helpTopicName = createdTicketData.helptopic.helpTopicName;
              var viewTicketLink = baseUrl + constants.VIEW_TICKET + ticketNumber;
              var assigneeEmailTo = "";
              for (let i of Object.entries(createdTicketData.dynamicFormJson)) {
                let processString = i[0].toString().toLowerCase().replace(/_/g, "")
                if (processString.includes("issuesummary")) {
                  ticketSubject = i[1];
                }
                if (processString.includes("issuedetails")) {
                  ticketDetails = i[1];
                }
              }

              await User.findByPk(createdTicketData.assigneeId)
                .then(async res => {
                  assigneeEmailTo = res.email;

                  /*Starts- Email Template Processing */
                  await EmailTemplate.findByPk(constants.ASSIGNEE_TICKET_TEMPLATE_ID)
                    .then(async data => {
                      var emailSubject = data.subject;
                      var emailBody = data.emailBody;
                      var EmailmapObj = {
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
                      const transporter = generalMethodsController.getEmailTransporter();
                      const settingsResponse = await tenantCoreSettingsController.getSettingsByTenantName();

                      var mailOptions = {
                        from: settingsResponse.dataValues.smtp_email,
                        to: assigneeEmailTo,
                        subject: emailSubject,
                        text: htmlToText(emailBody)
                      };
                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);

                        }
                      });
                    })
                    .catch(err => {
                      res.status(200).send({
                        message: "Error retrieving Email Template with id=" + 11
                      });
                    });

                })
                .catch(err => {
                  res.status(200).send({
                    message: "Error retrieving User id=" + createdTicketData.assigneeId
                  });
                });


            })
            .catch(err => {
              res.status(200).send({
                message: err.message || "Some error occurred while creating."
              });
            });
        })
      res.status(200).send({
        message: 'Data Update Successfully'
      });
    }
    console.log("*************************Update Assignee API Completed************************");
  } catch (exception) {
    console.log("*************************Update Assignee API Completed with Errors************************" + exception);
    res.status(200).send({
      message: err.message || "Some error occurred while creating."
    });
  }

}

exports.getAllTicketsForCentralPool = async (req, res) => {
  try {
    console.log("*************************Find All Tickets For Central Pool API Started************************");
    console.log("INPUT" + JSON.stringify(req.query));
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const queryParam = req.query.searchParam;
    let isTicketOverdue = req.query.isTicketOverdue;
    const departmentId = req.query.departmentId;
    let ticketStatus = req.query.ticketStatus;
    const assigneeId = req.query.assigneeId;
    const helpTopicId = req.query.helpTopicId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let closedStartDate = req.query.closedStartDate;
    let closedEndDate = req.query.closedEndDate;
    let nonEmptyKeys = [];
    let createdDates = { createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } };
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let sortColumns;
    nonEmptyKeys.push(createdDates);
    if (orderBy !== undefined && orderBy !== "undefined") {
      if (orderBy === 'subject') {
        sortColumns = ['dynamicFormJson', orderDirection];
      } else if (orderBy === 'userMobile') {
        sortColumns = ['fullName', orderDirection];
      } else if (orderBy === 'departmentName') {
        sortColumns = ['departmentId', orderDirection];
      } else if (orderBy === 'level1DueDate') {
        sortColumns = ['level1SlaDue', orderDirection];
      } else if (orderBy === 'helpTopicName') {
        sortColumns = ['helpTopicId', orderDirection];
      }
      else {
        sortColumns = [orderBy, orderDirection];
      }
    } else {
      sortColumns = ['createdAt', 'DESC'];
    }

    if (departmentId !== "undefined" && departmentId !== "" & departmentId !== null && departmentId !== "All") {
      let departJson = { "departmentId": departmentId };
      nonEmptyKeys.push(departJson);
    }
    // if (ticketStatus !== "undefined" && ticketStatus !== "" && ticketStatus !== null && ticketStatus !== "All") {
    //   let statusJson = { "ticketStatus": ticketStatus };
    //   nonEmptyKeys.push(statusJson);
    // }
    if (ticketStatus !== '' && ticketStatus !== 'All') {
      const status = ticketStatus.split(",");
      let statusJson = { ticketStatus: { [Op.in]: status } };
      nonEmptyKeys.push(statusJson);
    }
    if (assigneeId !== "undefined" && assigneeId !== "" & assigneeId !== null) {
      let assigneeJson = { "assigneeId": assigneeId };
      nonEmptyKeys.push(assigneeJson);
    }
    if (helpTopicId !== "undefined" && helpTopicId !== "" & helpTopicId !== null) {
      let helpTopicJson = { "helpTopicId": helpTopicId };
      nonEmptyKeys.push(helpTopicJson);
    }
    if (isTicketOverdue === 'Yes') {
      let overdueJson = { "isTicketOverdue": isTicketOverdue };
      nonEmptyKeys.push(overdueJson);
    } else if (isTicketOverdue === 'No') {
      let overdueJson = { "isTicketOverdue": null };
      nonEmptyKeys.push(overdueJson);
    }

    if (closedStartDate !== "undefined" && closedEndDate !== "undefined") {
      let closedDates = { closedDate: { [Op.between]: [`${closedStartDate}`, `${closedEndDate}`] } };
      nonEmptyKeys.push(closedDates);
    }

    var condition = { [Op.and]: nonEmptyKeys }

    //Start-Condition - (Search Param Only)
    if (queryParam !== "" && queryParam !== null) {
      var condition = { [Op.and]: [{ id: `${queryParam}` }] }
    }
    // End- Condtion 

    await Ticket.findAndCountAll({
      limit, offset, where: condition, include: [
        {
          model: db.department,
        },
        {
          model: db.helpTopic
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
    console.log("*************************Find All Tickets For Central Pool API Completed************************");
  } catch (exception) {
    console.log("*************************Find All Tickets For Central Pool API Completed with Errors************************" + exception);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tickets."
    });
  }

}

exports.submitTicketFeedback = async (req, res) => {
  try {
    console.log("*************************Submit Feedback API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    let feedbackFormLink = req.body.feedbacklinkId;
    let ticketSatisfaction = req.body.ticketSatisfaction;
    let reopenReason = req.body.reopenReason;

    if (ticketSatisfaction === "Yes") {
      await Ticket.update({
        ticketSatisfaction: ticketSatisfaction
      },
        { where: { feedbacklinkId: feedbackFormLink } })
        .then(async (updateResp) => {
          await Ticket.findOne({ where: { feedbacklinkId: feedbackFormLink } })
            .then(async (tickResp) => {
              let msgBody = constants.lbl_SATISFIED_TICKET
              let EmailmapObj = {
                "%{fullName}": tickResp.fullName,
                "%{satisfaction}": ticketSatisfaction
              };
              msgBody = msgBody.replace(/%{fullName}|%{satisfaction}|}/gi, function (matched) {
                return EmailmapObj[matched];
              });
              let htmlMessage = msgBody;
              const ticketThread = await generalMethodsController.maintainTicketThread(tickResp.fullName, null, htmlMessage, {}, tickResp.id, null, null, true, false);
              res.send(updateResp);
            })
            .catch((err) => {
              console.log(err);
              res.send(err);
            })
        })

    } else if (ticketSatisfaction === "No") {
      //Assign ticket to L1 assignee if closed by user itself previously.
      //If not then assign to the person who closes it.
      await Ticket.findOne({
        where: { feedbacklinkId: feedbackFormLink },
        include: [
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
        .then(async (tickResp) => {
          if (tickResp.ticketStatus === "Closed") {
            //Start--Send Lark Alert
            let ticketSubject = await generalMethodsController.getKeyFromDynamicFormJson(tickResp.dynamicFormJson, 'issuesummary');
            let ticketDetails = await generalMethodsController.getKeyFromDynamicFormJson(tickResp.dynamicFormJson, 'issuedetails');
            const larkAlertResp = await larkIntegrationController.createLarkAlerts(tickResp.user.openId, tickResp.id, ticketSubject, ticketDetails, tickResp.department.departmentName, tickResp.helptopic.helpTopicName, tickResp.user.fullName, tickResp.initialCreatedDate, tickResp.assigneeFullName, constants.lbl_ALERT_TYPE_REOPENED, tickResp.ticketStatus);
            //End--Send Lark Alert

            let reopenCount = tickResp.reopenThreadCount + 1;

            //If previous ticket status was closed then increase the reopen count of the ticket and assign it to the person who has previously closed it.
            //Check if modified SLA plan is present
            let slaInMinutes;
            let slaTimeResp;
            if (tickResp.modifiedSlaPlan) {
              slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.modifiedSlaPlan);
              slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.modifiedSlaPlan);
            } else {
              slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.slaPlan);
              slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.slaPlan);
            }
            await User.findByPk(tickResp.closedById).
              then(async (newAssigneeResp) => {
                //Start-In Case if ticket is closed user itself then as per the requirement assign to L1 assignee and in all cases reset the SLA triggers and created date of ticket.
                if (newAssigneeResp.isAgent === null || newAssigneeResp.isAgent === false || newAssigneeResp.isAgent === '') {
                  console.log("Previous CLOSED BY USER");
                  //Fetch the L1 assignee details based on ticket details
                  if (constants.COLLEGE_TYPES.includes(tickResp.schCol.toLowerCase())) {
                    await axios.post(constants.baseUrl + "api/collegeEscalation/getCollegeEscalationAssignee", { "department": tickResp.department.departmentName, "module": tickResp.helptopic.module, "openDepartmentId": tickResp.user.openDepartmentId })
                      .then(async (escalationResp) => {
                        console.log(escalationResp.data.l1email);
                        await axios.get(constants.baseUrl + "api/user/getUserByEmail", { params: { email: escalationResp.data.l1email } })
                          .then(async (assigneeResp) => {
                            console.log(assigneeResp.data.email);
                            console.log(slaTimeResp);
                            await Ticket.update({
                              ticketSatisfaction: ticketSatisfaction,
                              ticketStatus: "Re-Open",
                              closedDate: null,
                              closedBy: null,
                              closedById: null,
                              assigneeFullName: assigneeResp.data.fullName,
                              assigneeId: assigneeResp.data.id,//Assign to the person who has closed ticket
                              reopenThreadCount: reopenCount,
                              createdAt: new Date(),
                              slaPlanInMinutes: slaInMinutes,
                              level1SlaDue: slaTimeResp,
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
                              isTicketOverdue: null

                            },
                              { where: { id: tickResp.id } })
                              .then(async (res1) => {
                                await Ticket.findOne({ where: { feedbacklinkId: feedbackFormLink } })
                                  .then(async (tickResp) => {
                                    let msgBody = constants.lbl_NOT_SATISFIED_TICKET
                                    let EmailmapObj = {
                                      "%{fullName}": tickResp.fullName,
                                      "%{satisfaction}": ticketSatisfaction,
                                      "%{reason}": htmlToText(reopenReason)
                                    };
                                    msgBody = msgBody.replace(/%{fullName}|%{satisfaction}|%{reason}|}/gi, function (matched) {
                                      return EmailmapObj[matched];
                                    });
                                    let htmlMessage = msgBody;
                                    const ticketThread = await generalMethodsController.maintainTicketThread(tickResp.fullName, null, htmlMessage, {}, tickResp.id, null, null, true, false);
                                    res.send(tickResp);
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                    res.send(err);
                                  })
                              })
                          })
                          .catch((err) => {
                            console.log(err);
                          })
                      })
                      .catch((err) => {
                        console.log(err);
                      })
                  } else if (constants.ADMIN_TYPES.includes(tickResp.schCol.toLowerCase())) {
                    await axios.post(constants.baseUrl + "api/administrativeEscalation/getAdministrativeEscalationAssignee", { "department": tickResp.department.departmentName, "module": tickResp.helptopic.module, "openDepartmentId": tickResp.user.openDepartmentId })
                      .then(async (escalationResp) => {
                        console.log(escalationResp.data.l1email);
                        await axios.get(constants.baseUrl + "api/user/getUserByEmail", { params: { email: escalationResp.data.l1email } })
                          .then(async (assigneeResp) => {
                            console.log(assigneeResp.data.email);
                            console.log(slaTimeResp);
                            await Ticket.update({
                              ticketSatisfaction: ticketSatisfaction,
                              ticketStatus: "Re-Open",
                              closedDate: null,
                              closedBy: null,
                              closedById: null,
                              assigneeFullName: assigneeResp.data.fullName,
                              assigneeId: assigneeResp.data.id,//Assign to the person who has closed ticket
                              reopenThreadCount: reopenCount,
                              slaPlanInMinutes: slaInMinutes,
                              createdAt: new Date(),
                              level1SlaDue: slaTimeResp,
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
                              isTicketOverdue: null

                            },
                              { where: { id: tickResp.id } })
                              .then(async (res1) => {
                                await Ticket.findOne({ where: { feedbacklinkId: feedbackFormLink } })
                                  .then(async (tickResp) => {
                                    let msgBody = constants.lbl_NOT_SATISFIED_TICKET
                                    let EmailmapObj = {
                                      "%{fullName}": tickResp.fullName,
                                      "%{satisfaction}": ticketSatisfaction,
                                      "%{reason}": htmlToText(reopenReason)
                                    };
                                    msgBody = msgBody.replace(/%{fullName}|%{satisfaction}|%{reason}|}/gi, function (matched) {
                                      return EmailmapObj[matched];
                                    });
                                    let htmlMessage = msgBody;
                                    const ticketThread = await generalMethodsController.maintainTicketThread(tickResp.fullName, null, htmlMessage, {}, tickResp.id, null, null, true, false);
                                    res.send(tickResp);
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                    res.send(err);
                                  })

                              })
                          })
                          .catch((err) => {
                            console.log(err);
                          })
                      })
                      .catch((err) => {
                        console.log(err);
                      })
                  } else if (constants.SCHOOL_TYPES.includes(tickResp.schCol.toLowerCase())) {
                    await axios.post(constants.baseUrl + "api/schoolEscalation/getSchoolEscalationAssignee", { "department": tickResp.department.departmentName, "module": tickResp.helptopic.module, "openDepartmentId": tickResp.user.openDepartmentId })
                      .then(async (escalationResp) => {
                        console.log(escalationResp.data.l1email);
                        await axios.get(constants.baseUrl + "api/user/getUserByEmail", { params: { email: escalationResp.data.l1email } })
                          .then(async (assigneeResp) => {
                            console.log(assigneeResp.data.email);
                            console.log(slaTimeResp);
                            await Ticket.update({
                              ticketSatisfaction: ticketSatisfaction,
                              ticketStatus: "Re-Open",
                              closedDate: null,
                              closedBy: null,
                              closedById: null,
                              assigneeFullName: assigneeResp.data.fullName,
                              assigneeId: assigneeResp.data.id,//Assign to the person who has closed ticket
                              reopenThreadCount: reopenCount,
                              createdAt: new Date(),
                              slaPlanInMinutes: slaInMinutes,
                              level1SlaDue: slaTimeResp,
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
                              isTicketOverdue: null

                            },
                              { where: { id: tickResp.id } })
                              .then(async (res1) => {
                                await Ticket.findOne({ where: { feedbacklinkId: feedbackFormLink } })
                                  .then(async (tickResp) => {
                                    let msgBody = constants.lbl_NOT_SATISFIED_TICKET
                                    let EmailmapObj = {
                                      "%{fullName}": tickResp.fullName,
                                      "%{satisfaction}": ticketSatisfaction,
                                      "%{reason}": htmlToText(reopenReason)
                                    };
                                    msgBody = msgBody.replace(/%{fullName}|%{satisfaction}|%{reason}|}/gi, function (matched) {
                                      return EmailmapObj[matched];
                                    });
                                    let htmlMessage = msgBody;
                                    const ticketThread = await generalMethodsController.maintainTicketThread(tickResp.fullName, null, htmlMessage, {}, tickResp.id, null, null, true, false);
                                    res.send(tickResp);
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                    res.send(err);
                                  })
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
                } else {
                  //Else if agent assigned to the person who closes it.
                  console.log("Previous CLOSED BY AGENT");
                  //Check if modified SLA plan is present
                  let slaInMinutes;
                  let slaTimeResp;
                  if (tickResp.modifiedSlaPlan) {
                    slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.modifiedSlaPlan);
                    slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.modifiedSlaPlan);
                  } else {
                    slaInMinutes = await generalMethodsController.calculateSLAMinutes(tickResp.slaPlan);
                    slaTimeResp = await generalMethodsController.calculateSLATime(tickResp.slaPlan);
                  }

                  await Ticket.update({
                    ticketSatisfaction: ticketSatisfaction,
                    ticketStatus: "Re-Open",
                    closedDate: null,
                    closedBy: null,
                    closedById: null,
                    assigneeFullName: newAssigneeResp.fullName,
                    assigneeId: newAssigneeResp.id,//Assign to the person who has closed ticket
                    reopenThreadCount: reopenCount,
                    createdAt: new Date(),
                    slaPlanInMinutes: slaInMinutes,
                    level1SlaDue: slaTimeResp,
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
                    isTicketOverdue: null

                  },
                    { where: { id: tickResp.id } })
                    .then(async (res1) => {
                      await Ticket.findOne({ where: { feedbacklinkId: feedbackFormLink } })
                        .then(async (tickResp) => {
                          let msgBody = constants.lbl_NOT_SATISFIED_TICKET
                          let EmailmapObj = {
                            "%{fullName}": tickResp.fullName,
                            "%{satisfaction}": ticketSatisfaction,
                            "%{reason}": htmlToText(reopenReason)
                          };
                          msgBody = msgBody.replace(/%{fullName}|%{satisfaction}|%{reason}|}/gi, function (matched) {
                            return EmailmapObj[matched];
                          });
                          let htmlMessage = msgBody;
                          const ticketThread = await generalMethodsController.maintainTicketThread(tickResp.fullName, null, htmlMessage, {}, tickResp.id, null, null, true, false);
                          res.send(tickResp);
                        })
                        .catch((err) => {
                          console.log(err);
                          res.send(err);
                        })
                    })

                }
                //End-In Case if ticket is closed user itself then as per the requirement assign to L1 assignee and in all cases reset the SLA triggers and created date of ticket.

              })
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
    console.log("*************************Submit Feedback API Completed************************");
  } catch (exception) {
    console.log("*************************Submit Feedback API Completed with Errors************************" + exception);
    res.send(err);
  }


}
exports.getFeedbackInfo = async (req, res) => {
  try {
    console.log("*************************Get Feedback Info API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    let formUUId = req.body.formUUId;

    await Ticket.findOne({ where: { feedbacklinkId: formUUId } })
      .then(async (resp) => {
        if (resp.ticketSatisfaction === null) {
          res.send({ isFeedbackSubmitted: false });
        } else {
          res.send({ isFeedbackSubmitted: true });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      })
    console.log("*************************Get Feedback Info API Completed************************");
  } catch (exception) {
    console.log("*************************Get Feedback Info API Completed with Errors************************" + exception);
    res.send(err);
  }

}

exports.getTicketsCountForDisplay = async (req, res) => {
  console.log("*************************GetTicketsCountForDisplay API Started************************");
  console.log("INPUT" + JSON.stringify(req.body));
  try {
    const userId = req.body.userId;

    const userDetails = await User.findOne(({ where: { id: userId } }));
    const userEmail = userDetails.email;
    let responseObj = {}

    await Ticket.count({ where: { [Op.or]: [{ userId: userId }, { assigneeId: userId }] } })
      .then(async (resp) => {
        responseObj["myTicketsCount"] = resp;
        await Ticket.count()
          .then(async (resp) => {
            responseObj["allTicketsCount"] = resp;
          })
          .catch((err) => {
            console.log(err);
            res.status(200).send(err);
          })
        await Ticket.count({ where: { [Op.and]: [{ isTicketWithCentralPool: 1 }, { ticketStatus: { [Op.not]: "Closed" } }] } })
          .then(async (resp) => {
            responseObj["allTransferTickets"] = resp;
          })
          .catch((err) => {
            console.log(err);
            res.status(200).send(err);
          })
        await EscalatedTickets.count({ distinct: true, col: 'ticketId', where: { [Op.and]: [{ [Op.or]: [{ nextLevelEmail: `${userEmail}` }, { assigneeEmail: `${userEmail}` }] }] } })
          .then(async (resp) => {
            responseObj["allEscalatedTickets"] = resp;
            res.status(200).send(responseObj);
          })
          .catch((err) => {
            console.log(err);
            res.status(200).send(err);
          })
      })
      .catch((err) => {
        console.log(err);
        res.status(200).send(err);
      })
    console.log("*************************GetTicketsCountForDisplay API Completed************************");
  } catch (exception) {
    console.log("*************************GetTicketsCountForDisplay API Completed with Errors************************" + exception);
    res.status(200).send(exception);
  }
}

exports.updateSLATime = async (req, res) => {
  try {
    console.log("*************************Update SLA Time API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    const ticketId = req.body.ticketId;
    const slaPlan = req.body.slaPlan;
    const userId = req.body.userId;
    await Ticket.findByPk(ticketId).
      then(async (response) => {
        if (response) {
          let slaInMinutes = await generalMethodsController.calculateSLAMinutes(slaPlan);
          let level1SlaDueDate = await generalMethodsController.calculateNewSLATime(slaPlan, response.createdAt);
          await Ticket.update({ level1SlaDue: `${level1SlaDueDate}`, level2SlaDue: null, level3SlaDue: null, level4SlaDue: null, level5SlaDue: null, hodSlaDue: null, level1SlaTriggered: null, level2SlaTriggered: null, level3SlaTriggered: null, level4SlaTriggered: null, level5SlaTriggered: null, hodSlaTriggered: null, slaPlanInMinutes: `${slaInMinutes}`, modifiedSlaPlan: `${slaPlan}`, isTicketOverdue: null }, { where: { id: ticketId } })
            .then(async (updateResp) => {

              await User.findByPk(userId)
                .then(async (userResp) => {
                  let msgBody = constants.lbl_CHANGE_SLA_PLAN_TICKET;
                  let EmailmapObj = {
                    "%{fullName}": userResp.fullName,
                    "%{SLAPlan}": slaPlan
                  };
                  msgBody = msgBody.replace(/%{fullName}|%{SLAPlan}|}/gi, function (matched) {
                    return EmailmapObj[matched];
                  });
                  let htmlMessage = msgBody;
                  await generalMethodsController.maintainTicketThread(userResp.fullName, null, htmlMessage, null, ticketId, null, new Date(), true, false);
                })
                .catch((err) => {
                  console.log(err);
                })
              res.status(200).send({
                message: "SLA updated Successfully",
                success: true
              })
            })
            .catch((err) => {
              console.log(err);
              res.status(200).send({
                message: "Some error occurred please contact the administrator",
                success: false
              })
            })

        } else {
          res.status(200).send({
            message: "Error retrieving Ticket with id=" + ticketId,
            success: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(200).send({
          message: "Some error occurred please contact the administrator",
          success: false
        });
      })

    console.log("*************************Update SLA Time API Completed************************");
  } catch (exception) {
    console.log("*************************Update SLA Time API Completed with Errors************************" + exception);
    res.status(200).send({
      message: "Some error occurred please contact the administrator",
      success: false
    })
  }

}

exports.updateExistingDataForInitialDate = async (req, res) => {

  await Ticket.findAll({ where: { initialCreatedDate: null } })
    .then(async (resp) => {
      for (let i of resp) {
        await Ticket.update({ initialCreatedDate: i.createdAt }, { where: { id: i.id } })
          .then(async (updatedRes) => {
            console.log("Ticket" + " " + i.id);
          })
          .catch((err) => {
            console.log(err);
          })
      }
      res.status(200).send(({ "success": true }));
    })
    .catch((err) => {
      console.log(err);
    })
}