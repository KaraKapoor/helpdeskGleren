const db = require("../models");
const TicketReplies = db.ticketReplies;
const Ticket = db.ticket;
const TicketHistory = db.ticketHistory;
var { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');
const constants = require("../constants/constants");
const { user, ticket } = require("../models");
const EscalatedTicket = db.escalatedTickets;
const User = db.user;
const Op = db.Sequelize.Op;
const axios = require('axios');
const AWS = require('aws-sdk');
const tenantCoreSettingsController = require("../controllers/tenantSettings.controller.js");
const administrativeController = require("../controllers/administrativeEscalation.controller.js");
exports.maintainTicketThread = async (repliedBy, recepients, message, s3FilesUrl, ticketId, textMessage, messageDateTime, isTicketActivityThread, usedInCannedFilters) => {

  const ticketReplyObj = {
    repliedby: repliedBy,
    recepients: recepients,
    message: message,
    s3FilesUrl: s3FilesUrl,
    ticketId: ticketId,
    textMessage: textMessage,
    messageDateTime: messageDateTime,
    isTicketActivityThread: isTicketActivityThread,
    usedInCannedFilters: usedInCannedFilters
  }

  await TicketReplies.create(ticketReplyObj)
    .then(async (res) => {
      console.log("Inserted in ticket replies");
    })
    .catch((err) => {
      console.log(err);
    })
}

exports.sendEmail = async (assigneeEmailTo, emailSubject, ccEmails, emailBody) => {
  const transporter = await this.getEmailTransporter();
  const settingsResponse = await tenantCoreSettingsController.getSettingsByTenantName();
  var mailOptions = {
    from: settingsResponse.dataValues.smtp_email,
    to: assigneeEmailTo,
    subject: emailSubject,
    cc: ccEmails,
    text: htmlToText(emailBody)
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);

    }
  });
}
exports.insertDateInTicketHistory = async (ticketId) => {
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
        ticketSubCategory: resp.ticketSubCategory,
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
        closedById: resp.closedById,
        activeEscalationLevel: resp.activeEscalationLevel,
        activeEscalatedId: resp.activeEscalatedId,
        nspiraCode: resp.nspiraCode,
        payrollCode: resp.payrollCode,
        state: resp.state,
        district: resp.district

      }

      TicketHistory.create(ticketHistoryObj)
        .then(async (historyResp) => {

        })
    })
}

exports.calculateSLATime = async (slaPlan) => {
  let slaInMinutes;
  let level1SlaDueDate;
  if (slaPlan === (constants.SLA_PLAN_24)) {
    slaInMinutes = 1440;//Store minutes
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_48)) {
    slaInMinutes = 2880;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_96)) {
    slaInMinutes = 5760;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_1)) {
    slaInMinutes = 60;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_30M)) {
    slaInMinutes = 30;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_1DAY) {
    slaInMinutes = 1440;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_2DAY) {
    slaInMinutes = 2880;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_3DAY) {
    slaInMinutes = 4320;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_4DAY) {
    slaInMinutes = 5760;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_5DAY) {
    slaInMinutes = 7200;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_6DAY) {
    slaInMinutes = 8640;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_7DAY) {
    slaInMinutes = 10080;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_8DAY) {
    slaInMinutes = 11520;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_9DAY) {
    slaInMinutes = 12960;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_10DAY) {
    slaInMinutes = 14400;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else {
    let extractedNumber = slaPlan.match(/\d+/)[0];
    slaInMinutes = extractedNumber * 24 * 60;
    level1SlaDueDate = new Date();
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  }
  return level1SlaDueDate;
}
exports.calculateSLAMinutes = async (slaPlan) => {
  let slaInMinutes;
  if (slaPlan === (constants.SLA_PLAN_24)) {
    slaInMinutes = 1440;//Store minutes
  } else if (slaPlan === (constants.SLA_PLAN_48)) {
    slaInMinutes = 2880;
  } else if (slaPlan === (constants.SLA_PLAN_96)) {
    slaInMinutes = 5760;
  } else if (slaPlan === (constants.SLA_PLAN_1)) {
    slaInMinutes = 60;
  } else if (slaPlan === (constants.SLA_PLAN_30M)) {
    slaInMinutes = 30;
  } else if (slaPlan === constants.SLA_PLAN_1DAY) {
    slaInMinutes = 1440;
  } else if (slaPlan === constants.SLA_PLAN_2DAY) {
    slaInMinutes = 2880;
  } else if (slaPlan === constants.SLA_PLAN_3DAY) {
    slaInMinutes = 4320;
  } else if (slaPlan === constants.SLA_PLAN_4DAY) {
    slaInMinutes = 5760;
  } else if (slaPlan === constants.SLA_PLAN_5DAY) {
    slaInMinutes = 7200;
  } else if (slaPlan === constants.SLA_PLAN_6DAY) {
    slaInMinutes = 8640;
  } else if (slaPlan === constants.SLA_PLAN_7DAY) {
    slaInMinutes = 10080;
  } else if (slaPlan === constants.SLA_PLAN_8DAY) {
    slaInMinutes = 11520;
  } else if (slaPlan === constants.SLA_PLAN_9DAY) {
    slaInMinutes = 12960;
  } else if (slaPlan === constants.SLA_PLAN_10DAY) {
    slaInMinutes = 14400;
  } else {
    let extractedNumber = slaPlan.match(/\d+/)[0];
    slaInMinutes = extractedNumber * 24 * 60 //Convert days to minutes
  }
  return slaInMinutes;
}
exports.calculateNewSLATime = async (slaPlan, createdDate) => {
  let slaInMinutes;
  let level1SlaDueDate;
  if (slaPlan === (constants.SLA_PLAN_24)) {
    slaInMinutes = 1440;//Store minutes
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_48)) {
    slaInMinutes = 2880;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_96)) {
    slaInMinutes = 5760;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_1)) {
    slaInMinutes = 60;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === (constants.SLA_PLAN_30M)) {
    slaInMinutes = 30;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_1DAY) {
    slaInMinutes = 1440;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_2DAY) {
    slaInMinutes = 2880;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_3DAY) {
    slaInMinutes = 4320;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_4DAY) {
    slaInMinutes = 5760;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_5DAY) {
    slaInMinutes = 7200;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_6DAY) {
    slaInMinutes = 8640;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_7DAY) {
    slaInMinutes = 10080;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_8DAY) {
    slaInMinutes = 11520;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_9DAY) {
    slaInMinutes = 12960;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else if (slaPlan === constants.SLA_PLAN_10DAY) {
    slaInMinutes = 14400;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  } else {
    let extractedNumber = slaPlan.match(/\d+/)[0];
    slaInMinutes = extractedNumber * 24 * 60;
    level1SlaDueDate = new Date(createdDate);
    level1SlaDueDate.setMinutes(level1SlaDueDate.getMinutes() + slaInMinutes);
  }
  return level1SlaDueDate;
}

exports.dataCorrect = async (req, res) => {
  try {
    console.log("*************************Data Correction API Started************************");
    console.log("INPUT" + JSON.stringify(req.body));
    let processMore = true;
    let limit = 1000;
    let offset = 0;
    while (processMore) {
      const ticketsResp = await Ticket.findAll({
        offset: offset, limit: limit, include: [
          {
            model: db.helpTopic,
          },
          {
            model: db.user,
          },
          {
            model: db.department,
          }
        ]
      });
      if (ticketsResp) {
        if (ticketsResp.length > 0) {
          processMore = true;
          offset = offset + 1;
        } else {
          processMore = false;
        }
        for (let i of ticketsResp) {

          if (constants.COLLEGE_TYPES.includes(i.user.officeType.toLowerCase())) {
            var apiPath = "api/collegeEscalation/getCollegeEscalationAssignee";
          } else if (constants.SCHOOL_TYPES.includes(i.user.officeType.toLowerCase())) {
            var apiPath = "api/schoolEscalation/getSchoolEscalationAssignee";
          } else if (constants.ADMIN_TYPES.includes(i.user.officeType.toLowerCase())) {
            var apiPath = "api/administrativeEscalation/getAdministrativeEscalationAssignee";
          }
          await axios.post(constants.baseUrl + apiPath, { "department": i.department.departmentName, "module": i.helptopic.module, "openDepartmentId": i.user.openDepartmentId })
            .then(async (resp) => {
              if (resp!==null && resp.data !== null) {
                const nspiraCode = resp.data.nspiraCode;
                const district = resp.data.district;
                const state = resp.data.state;
                const payrollCode = resp.data.payrollCode;
                await ticket.update({nspiraCode:nspiraCode,state:state,district:district,payrollCode:payrollCode},{where:{id:i.id}});
              }else{
                console.log(resp);
              }
            })

        }
        // res.status(200).send({
        //   sucess: true,
        // });
      }
    }

    console.log("*************************Data Correction API Completed************************");
  } catch (exception) {
    console.log("*************************Data Correction API Completed with Errors************************" + exception);
    // res.status(500).send({
    //   message: "Some error occurred while retrieving.",
    // });
  }
}

exports.getKeyFromDynamicFormJson = (dynamicFormJson, keyToFind) => {
  for (let i of Object.entries(dynamicFormJson)) {
    let processString = i[0].toString().toLowerCase().replace(/_/g, "")
    if (processString.includes(keyToFind)) {
      return i[1];
    }
  }
}
exports.findPercentage = (value, total) => {
  const percentage = (value / total) * 100;
  return percentage.toFixed(2);
}

exports.getZeroForNullValue = (value) => {
  if (value === null) {
    return 0;
  } else {
    return value;
  }
}

exports.convertCommaSeparatedStringToArray = (valueInString) => {
  if (valueInString !== null && valueInString !== undefined && valueInString !== "undefined") {
    var array = valueInString.split(',');
    return array;
  }
  else {
    return [];
  }
}

exports.do_Null_Undefined_EmptyArray_Check = (value) => {
  if (value === null || value === "null" || value === undefined || value === "undefined" || value.length === 0 || value === "") {
    return null;
  } else {
    return value;
  }
}

exports.remove_Percent_Symbol_FromValue = (value) => {
  var newValue = (value.replace(/%/g, ''));
  return newValue;
}
exports.getUserRoles = (inputValue) => {
  if (inputValue != null) {
    let str = inputValue.toLowerCase();
    const value = str.replace(/ /g, "");
    if (value === 'agent') {
      return "Agent"
    } else if (value === 'centralagent') {
      return "Central Agent"
    } else if (value === 'centraladmin') {
      return "Central Admin"
    } else if (value === 'teamlead') {
      return "Team Lead"
    }
  } else {
    return "Normal User"
  }
}
exports.get_S3_Config = () => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
  })
  return s3;
}

exports.getBucketName = () => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || null;
  return bucketName;
}

exports.getEmailTransporter = async () => {
  const settingsResponse = await tenantCoreSettingsController.getSettingsByTenantName();
  const transporter = nodemailer.createTransport({
    host: settingsResponse.dataValues.smtp_host,
    port: settingsResponse.dataValues.smtp_port,
    auth: {
      user: settingsResponse.dataValues.smtp_user,
      pass: settingsResponse.dataValues.smtp_password
    }
  });
  return transporter;
}

exports.splitStringFromCharacter = async (string, splitChar, isBothStringRequired) => {
  const inputString = string;
  const modifiedtring = inputString.split(splitChar);
  if (isBothStringRequired) {
    return modifiedtring;
  } else {
    return modifiedtring[0];
  }
}