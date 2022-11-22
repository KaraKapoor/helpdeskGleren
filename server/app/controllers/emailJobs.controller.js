const db = require("../models");
const EmailJobs = db.emailJobs;
const Op = db.Sequelize.Op;
const constants = require("../constants/constants");
const EmailTemplate = db.emailTemplate;
const CollegeEscalation = db.collegeEscalation;
const SchoolEscalation = db.schoolEscalation;
const EscalatedTickets = db.escalatedTickets;
const Tickets = db.ticket;
const TicketReplies = db.ticketReplies;
const User = db.user;
const axios = require('axios');
var { htmlToText } = require('html-to-text');
const e = require("express");
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const larkIntegrationController = require("../controllers/larkIntegrationController.js");

// exports.findAll = async (req, res) => {

//     await EmailJobs.findAll({
//         where: { [Op.and]: [{ isEmailSend: false }, { email: null }] }, include: { all: true, nested: true }
//     })
//         .then(async (data) => {
//             for (let j of data) {

//                 let assigneeEmailTo = "";
//                 let assigneeFullName = "";
//                 let ccRecepients = "";
//                 let escalatedLevel;
//                 let nextLevelEmail = null;
//                 let currentAssignee = null;

//                 //Fetch the current assignee of the ticket from tickets table
//                 await User.findByPk(j.ticket.assigneeId)
//                     .then(async res => {
//                         if(res){
//                             currentAssignee = res.email;
//                         }

//                         //Fetch the details of all level's assignees.
//                         if (constants.COLLEGE_TYPES.includes(j.ticket.schCol.toLowerCase())) {
//                             await axios
//                                 .post(constants.baseUrl + 'api/collegeEscalation/getCollegeEscalationAssignee', {
//                                     "department": j.ticket.department.departmentName,
//                                     "module": j.ticket.helptopic.module,
//                                     "openDepartmentId": j.ticket.user.openDepartmentId
//                                 })
//                                 .then(async (res) => {
//                                     const resp = res.data;
//                                     console.log("RESPONSE" + resp.toString());
//                                     if (j.escalationLevel.toLowerCase().includes("level1")) {

//                                         if (resp.l1email != null && resp.l1email != "" && resp.l1email != "0") {
//                                             assigneeEmailTo = resp.l1email;
//                                             assigneeFullName = resp.l1name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }



//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l2email != null && resp.l2email != "" && resp.l2email != "0") {
//                                             nextLevelEmail = resp.l2email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level2")) {
//                                         if (resp.l2email != null && resp.l2email != "" && resp.l2email != "0") {
//                                             assigneeEmailTo = resp.l2email;
//                                             assigneeFullName = resp.l2name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }


//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l3email != null && resp.l3email != "" && resp.l3email != "0") {
//                                             nextLevelEmail = resp.l3email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email)
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level3")) {
//                                         if (resp.l3email != null && resp.l3email != "" && resp.l3email != "0") {
//                                             assigneeEmailTo = resp.l3email;
//                                             assigneeFullName = resp.l3name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }


//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l4email != null && resp.l4email != "" && resp.l4email != "0") {
//                                             nextLevelEmail = resp.l4email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc
//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level4")) {

//                                         if (resp.l4email != null && resp.l4email != "" && resp.l4email != "0") {
//                                             assigneeEmailTo = resp.l4email;
//                                             assigneeFullName = resp.l4name;
//                                             escalatedLevel = j.escalationLevel;
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }


//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l5email != null && resp.l5email != "" && resp.l5email != "0") {
//                                             nextLevelEmail = resp.l5email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }
//                                         //End-Move to the next level assignee if immediate next assignee is not present.


//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc
//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level5")) {
//                                         if (resp.l5email != null && resp.l5email != "" && resp.l5email != "0") {
//                                             assigneeEmailTo = resp.l5email;
//                                             assigneeFullName = resp.l5name;
//                                             escalatedLevel = j.escalationLevel;
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }


//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.hodemail != null && resp.hodemail != "" && resp.hodemail != "0") {
//                                             nextLevelEmail = resp.hodemail;
//                                         } else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccEmailsArray.push(resp.l4email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("hod")) {
//                                         if (resp.hodemail != null && resp.hodemail != "" && resp.hodemail != "0") {
//                                             assigneeEmailTo = resp.hodemail;
//                                             assigneeFullName = resp.hodname;
//                                             escalatedLevel = j.escalationLevel;
//                                             nextLevelEmail = "NA";
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                             nextLevelEmail = "NA";
//                                         }


//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccEmailsArray.push(resp.l4email);
//                                         ccEmailsArray.push(resp.l5email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc


//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }

//                                 })
//                         }
//                         if (constants.SCHOOL_TYPES.includes(j.ticket.schCol.toLowerCase())) {
//                             await axios
//                                 .post(constants.baseUrl + 'api/schoolEscalation/getSchoolEscalationAssignee', {
//                                     "department": j.ticket.department.departmentName,
//                                     "module": j.ticket.helptopic.module,
//                                     "openDepartmentId": j.ticket.user.openDepartmentId
//                                 })
//                                 .then(async (resp) => {
//                                     if (j.escalationLevel.toLowerCase().includes("level1")) {
//                                         if (resp.l1email != null && resp.l1email != "" && resp.l1email != "0") {
//                                             assigneeEmailTo = resp.l1email;
//                                             assigneeFullName = resp.l1name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l2email != null && resp.l2email != "" && resp.l2email != "0") {
//                                             nextLevelEmail = resp.l2email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level2")) {
//                                         if (resp.l2email != null && resp.l2email != "" && resp.l2email != "0") {
//                                             assigneeEmailTo = resp.l2email;
//                                             assigneeFullName = resp.l2name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l3email != null && resp.l3email != "" && resp.l3email != "0") {
//                                             nextLevelEmail = resp.l3email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level3")) {
//                                         if (resp.l3email != null && resp.l3email != "" && resp.l3email != "0") {
//                                             assigneeEmailTo = resp.l3email;
//                                             assigneeFullName = resp.l3name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.

//                                         if (resp.l4email != null && resp.l4email != "" && resp.l4email != "0") {
//                                             nextLevelEmail = resp.l4email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc
//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level4")) {
//                                         if (resp.l4email != null && resp.l4email != "" && resp.l4email != "0") {
//                                             assigneeEmailTo = resp.l4email;
//                                             assigneeFullName = resp.l4name;
//                                             escalatedLevel = j.escalationLevel;
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.

//                                         if (resp.l5email != null && resp.l5email != "" && resp.l5email != "0") {
//                                             nextLevelEmail = resp.l5email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);

//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level5")) {
//                                         if (resp.l5email != null && resp.l5email != "" && resp.l5email != "0") {
//                                             assigneeEmailTo = resp.l5email;
//                                             assigneeFullName = resp.l5name;
//                                             escalatedLevel = j.escalationLevel;
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }


//                                         //Start-Move to the next level assignee if immediate next assignee is not present.

//                                         if (resp.hodemail != null && resp.hodemail != "" && resp.hodemail != "0") {
//                                             nextLevelEmail = resp.hodemail;
//                                         } else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccEmailsArray.push(resp.l4email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("hod")) {
//                                         if (resp.hodemail != null && resp.hodemail != "" && resp.hodemail != "0") {
//                                             assigneeEmailTo = resp.hodemail;
//                                             assigneeFullName = resp.hodname;
//                                             escalatedLevel = j.escalationLevel;
//                                             nextLevelEmail = "NA";
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                             nextLevelEmail = "NA";
//                                         }


//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccEmailsArray.push(resp.l4email);
//                                         ccEmailsArray.push(resp.l5email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                 })
//                         }
//                         if (constants.ADMIN_TYPES.includes(j.ticket.schCol.toLowerCase())) {
//                             await axios
//                                 .post(constants.baseUrl + 'api/administrativeEscalation/getAdministrativeEscalationAssignee', {
//                                     "department": j.ticket.department.departmentName,
//                                     "module": j.ticket.helptopic.module,
//                                     "openDepartmentId": j.ticket.user.openDepartmentId
//                                 })
//                                 .then(async (resp) => {
//                                     if (j.escalationLevel.toLowerCase().includes("level1")) {
//                                         if (resp.l1email != null && resp.l1email != "" && resp.l1email != "0") {
//                                             assigneeEmailTo = resp.l1email;
//                                             assigneeFullName = resp.l1name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l2email != null && resp.l2email != "" && resp.l2email != "0") {
//                                             nextLevelEmail = resp.l2email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level2")) {
//                                         if (resp.l2email != null && resp.l2email != "" && resp.l2email != "0") {
//                                             assigneeEmailTo = resp.l2email;
//                                             assigneeFullName = resp.l2name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.
//                                         if (resp.l3email != null && resp.l3email != "" && resp.l3email != "0") {
//                                             nextLevelEmail = resp.l3email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level3")) {
//                                         if (resp.l3email != null && resp.l3email != "" && resp.l3email != "0") {
//                                             assigneeEmailTo = resp.l3email;
//                                             assigneeFullName = resp.l3name;
//                                             escalatedLevel = j.escalationLevel;
//                                         }
//                                         else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.

//                                         if (resp.l4email != null && resp.l4email != "" && resp.l4email != "0") {
//                                             nextLevelEmail = resp.l4email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc
//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level4")) {
//                                         if (resp.l4email != null && resp.l4email != "" && resp.l4email != "0") {
//                                             assigneeEmailTo = resp.l4email;
//                                             assigneeFullName = resp.l4name;
//                                             escalatedLevel = j.escalationLevel;
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }

//                                         //Start-Move to the next level assignee if immediate next assignee is not present.

//                                         if (resp.l5email != null && resp.l5email != "" && resp.l5email != "0") {
//                                             nextLevelEmail = resp.l5email;
//                                         }
//                                         else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);

//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("level5")) {
//                                         if (resp.l5email != null && resp.l5email != "" && resp.l5email != "0") {
//                                             assigneeEmailTo = resp.l5email;
//                                             assigneeFullName = resp.l5name;
//                                             escalatedLevel = j.escalationLevel;
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                         }


//                                         //Start-Move to the next level assignee if immediate next assignee is not present.

//                                         if (resp.hodemail != null && resp.hodemail != "" && resp.hodemail != "0") {
//                                             nextLevelEmail = resp.hodemail;
//                                         } else {
//                                             nextLevelEmail = "NA";
//                                         }

//                                         //End-Move to the next level assignee if immediate next assignee is not present.

//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccEmailsArray.push(resp.l4email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                     if (j.escalationLevel.toLowerCase().includes("hod")) {
//                                         if (resp.hodemail != null && resp.hodemail != "" && resp.hodemail != "0") {
//                                             assigneeEmailTo = resp.hodemail;
//                                             assigneeFullName = resp.hodname;
//                                             escalatedLevel = j.escalationLevel;
//                                             nextLevelEmail = "NA";
//                                         } else {
//                                             assigneeEmailTo = "NA";
//                                             assigneeFullName = "NA";
//                                             escalatedLevel = j.escalationLevel;
//                                             nextLevelEmail = "NA";
//                                         }


//                                         let ccEmailsArray = [];
//                                         ccEmailsArray.push(resp.l1email);
//                                         ccEmailsArray.push(resp.l2email);
//                                         ccEmailsArray.push(resp.l3email);
//                                         ccEmailsArray.push(resp.l4email);
//                                         ccEmailsArray.push(resp.l5email);
//                                         ccRecepients = ccEmailsArray.join(); //Add previous level emails in cc

//                                         const test = await processEmailTemplateAndTriggerEmail(j.ticket.id, j.ticket.dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee);
//                                         //Start-update the next sla time in tickets table
//                                         const slaTime = await updateSlaTime(j.escalationLevel, j.ticket.id, j.ticket.slaPlanInMinutes, j.ticket.createdAt)
//                                         //End-update the next sla time in tickets table
//                                         const maintainThread = await maintainTicketThread(j.escalationLevel, j.ticket.id, assigneeFullName);
//                                     }
//                                 })
//                         }

//                     })
//                     .catch(err => {
//                         console.log(err);
//                         console.log(err + "AssigneeID=" + j.ticket.assigneeId);
//                     });
//                 //End fetching current ticket assignee.



//                 async function processEmailTemplateAndTriggerEmail(ticketId, dynamicFormJson, assigneeFullName, assigneeEmailTo, ccRecepients, escalatedLevel, nextLevelEmail, currentAssignee) {
//                     let baseUrl = constants.baseUrl;
//                     let ticketNumber = ticketId;
//                     // let assigner = j.ticket.fullName;
//                     let ticketSubject = "";
//                     let ticketDetails = "";
//                     // let helpTopicName = j.ticket.helptopic.helpTopicName;
//                     let viewTicketLink = baseUrl + constants.VIEW_TICKET + ticketNumber;
//                     for (let i of Object.entries(dynamicFormJson)) {
//                         let processString = i[0].toString().toLowerCase().replace(/_/g, "")
//                         if (processString.includes("issuesummary")) {
//                             ticketSubject = i[1];
//                         }
//                         if (processString.includes("issuedetails")) {
//                             ticketDetails = i[1];
//                         }
//                     }
//                     /*Starts- Email Template Processing */
//                     await EmailTemplate.findByPk(constants.OVERDUE_TICKET_TEMPLATE_ID)
//                         .then(async data => {
//                             // let emailSubject = "Test ticket - Ignore this email";
//                             let emailSubject = data.subject;
//                             let emailBody = data.emailBody;
//                             let EmailmapObj = {
//                                 "%{recipient.name}": assigneeFullName,
//                                 "%{ticket.staff_link}": viewTicketLink,
//                                 "%{ticket.number}": ticketNumber,
//                                 "%{ticket.dept.manager.name}": "",//Need to confirm manager details,
//                             };
//                             emailBody = emailBody.replace(/%{recipient.name}|%{ticket.staff_link}|%{ticket.number}|%{ticket.dept.manager.name}/gi, function (matched) {
//                                 return EmailmapObj[matched];
//                             });
//                             const transporter = nodemailer.createTransport({
//                                 host: emailConfig.HOST,
//                                 port: emailConfig.PORT,
//                                 auth: {
//                                     user: emailConfig.AUTH.USER,
//                                     pass: emailConfig.AUTH.PASS
//                                 }
//                             });

//                             var mailOptions = {
//                                 from: emailConfig.FROM,
//                                 // to:"sandhya.tulasi@nspira.in,deepa.gunda@nspira.in,venkatasatyanarayana.kavala@nspira.in,niranjan.nidadavolu@nspira.in,sricharan@nspira.in",
//                                 to: assigneeEmailTo,
//                                 cc: ccRecepients,
//                                 // to:"psapra@smaera.com",
//                                 subject: emailSubject,
//                                 text: htmlToText(emailBody)
//                                 // text:"This email is for: "+" "+assigneeEmailTo+" "+"All Cc Receipents are:  "+" "+ccRecepients+" "+"\n".concat(htmlToText(emailBody))
//                             };

//                             console.log("Email From" + emailConfig.FROM);
//                             console.log("Email To " + assigneeEmailTo);
//                             console.log("ccReceipents" + ccRecepients);
//                             console.log("Email Subject" + emailSubject);
//                             console.log("Email Body" + htmlToText(emailBody));

//                             if (assigneeEmailTo != "" && assigneeEmailTo != "NA") {
//                                 await transporter.sendMail(mailOptions, function (error, info) {
//                                     if (error) {
//                                         console.log(error);
//                                     } else {
//                                         console.log('Email sent: ' + info.response);
//                                         //update the flag isEmailSend in DB
//                                         EmailJobs.update({ isEmailSend: true, email: `${assigneeEmailTo}` },
//                                             { where: { id: j.id } })
//                                             .then(async (d) => {
//                                                 //Insert the escalated tickets to escaltedTickets table.
//                                                 const escalatedTicketsObj = {
//                                                     ticketId: ticketNumber,
//                                                     escalatedLevel: escalatedLevel,
//                                                     nextLevelEmail: nextLevelEmail,
//                                                     assigneeEmail: currentAssignee,
//                                                     activeEscalationLevel: 1
//                                                 };
//                                                 await EscalatedTickets.create(escalatedTicketsObj)
//                                                     .then(async (data) => {
//                                                         console.log("Escalated Ticket Details inserted into DB" + data);
//                                                         await EscalatedTickets.findAll({ where: { [Op.and]: [{ ticketId: `${ticketNumber}` }] } })
//                                                             .then(async (data1) => {
//                                                                 for (let d1 of data1) {
//                                                                     if (d1.escalatedLevel === escalatedLevel) {
//                                                                         EscalatedTickets.update({ activeEscalationLevel: 1 },
//                                                                             { where: { id: d1.id } })
//                                                                     } else {
//                                                                         EscalatedTickets.update({ activeEscalationLevel: 0 },
//                                                                             { where: { id: d1.id } })
//                                                                     }

//                                                                 }
//                                                             })
//                                                     })
//                                                     .catch((err) => {
//                                                         console.log("Error" + err);
//                                                     });
//                                             })
//                                     }
//                                 });
//                             } else {
//                                 //Directly update the send email flag as true if for any level assignee email not present.
//                                 await EmailJobs.update({ isEmailSend: true, email: `${assigneeEmailTo}` },
//                                     { where: { id: j.id } })
//                                     .then(async (d) => {
//                                         //Insert the escalated tickets to escaltedTickets table.
//                                         const escalatedTicketsObj = {
//                                             ticketId: ticketNumber,
//                                             escalatedLevel: escalatedLevel,
//                                             nextLevelEmail: nextLevelEmail,
//                                             assigneeEmail: currentAssignee,
//                                             activeEscalationLevel: 1

//                                         };
//                                         await EscalatedTickets.create(escalatedTicketsObj)
//                                             .then(async (data) => {
//                                                 console.log("Escalated Ticket Details inserted into DB" + data);
//                                                 await EscalatedTickets.findAll({ where: { [Op.and]: [{ ticketId: `${ticketNumber}` }] } })
//                                                     .then(async (data1) => {
//                                                         for (let d1 of data1) {
//                                                             if (d1.escalatedLevel === escalatedLevel) {
//                                                                 EscalatedTickets.update({ activeEscalationLevel: 1 },
//                                                                     { where: { id: d1.id } })
//                                                             } else {
//                                                                 EscalatedTickets.update({ activeEscalationLevel: 0 },
//                                                                     { where: { id: d1.id } })
//                                                             }

//                                                         }
//                                                     })
//                                             })
//                                             .catch((err) => {
//                                                 console.log("Error" + err);
//                                             });
//                                     })

//                             }

//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });
//                 }

//                 async function updateSlaTime(level, ticketId, slaInMinutes, createdAt) {
//                     let level2SlaDue;
//                     let level3SlaDue;
//                     let level4SlaDue;
//                     let level5SlaDue;
//                     let hodSlaDue;
//                     if (level.toLowerCase().includes("level1")) {
//                         level2SlaDue = createdAt;
//                         level2SlaDue.setMinutes(level2SlaDue.getMinutes() + slaInMinutes * 2);
//                         await updateTicketSLA("level2SlaDue", level2SlaDue, ticketId);
//                     }
//                     if (level.toLowerCase().includes("level2")) {
//                         level3SlaDue = createdAt;
//                         level3SlaDue.setMinutes(level3SlaDue.getMinutes() + slaInMinutes * 3);
//                         await updateTicketSLA("level3SlaDue", level3SlaDue, ticketId);
//                     }
//                     if (level.toLowerCase().includes("level3")) {
//                         level4SlaDue = createdAt;
//                         level4SlaDue.setMinutes(level4SlaDue.getMinutes() + slaInMinutes * 4);
//                         await updateTicketSLA("level4SlaDue", level4SlaDue, ticketId);
//                     }
//                     if (level.toLowerCase().includes("level4")) {
//                         level5SlaDue = createdAt;
//                         level5SlaDue.setMinutes(level5SlaDue.getMinutes() + slaInMinutes * 5);
//                         await updateTicketSLA("level5SlaDue", level5SlaDue, ticketId);
//                     }
//                     if (level.toLowerCase().includes("level5")) {
//                         hodSlaDue = createdAt;
//                         hodSlaDue.setMinutes(hodSlaDue.getMinutes() + slaInMinutes * 6);
//                         await updateTicketSLA("hodSlaDue", hodSlaDue, ticketId);
//                     }


//                     async function updateTicketSLA(dueDateColumnName, dueDateValue, ticketId) {
//                         Tickets.update({ [dueDateColumnName]: `${dueDateValue}` },
//                             { where: { id: ticketId } })
//                             .then((response) => {

//                             })
//                             .catch((err) => {
//                                 console.log(err);
//                             })
//                     }
//                 }
//                 async function maintainTicketThread(escalatedLevel, ticketId, assigneeFullName) {
//                     if (assigneeFullName === "NA") {
//                         return null;
//                     }

//                     await Tickets.findOne({ where: { id: ticketId } })
//                         .then(async (res) => {
//                             let escalatedTime
//                             if (escalatedLevel.toLowerCase().includes("level1")) {
//                                 escalatedTime = res.level1SlaDue;
//                             }
//                             if (escalatedLevel.toLowerCase().includes("level2")) {
//                                 escalatedTime = res.level2SlaDue;
//                             }
//                             if (escalatedLevel.toLowerCase().includes("level3")) {
//                                 escalatedTime = res.level3SlaDue;
//                             }
//                             if (escalatedLevel.toLowerCase().includes("level4")) {
//                                 escalatedTime = res.level4SlaDue;
//                             }
//                             if (escalatedLevel.toLowerCase().includes("level5")) {
//                                 escalatedTime = res.level5SlaDue;
//                             }
//                             if (escalatedLevel.toLowerCase().includes("hod")) {
//                                 escalatedTime = res.hodSlaDue;
//                             }

//                             let msgBody = constants.lbl_ESCALATE_TICKET;
//                             let EmailmapObj = {
//                                     "%{fullName}": assigneeFullName,
//                                     "%{level}": escalatedLevel
//                                     };
//                                     msgBody = msgBody.replace(/%{fullName}|%{level}|}/gi, function (matched) {
//                                     return EmailmapObj[matched];
//                                     });
//                             let htmlMessage=msgBody;
//                             const ticketReplies = {
//                                 repliedby: "System",
//                                 ticketId: ticketId,
//                                 message:htmlMessage,
//                                 messageDateTime: escalatedTime,
//                                 isTicketActivityThread:true
//                             };

//                             await TicketReplies.create(ticketReplies)
//                                 .then(async (res) => {
//                                     console.log("Thread updated");
//                                 })
//                                 .catch((err) => {
//                                     console.log(err);
//                                 })
//                         })

//                         .catch((err) => {
//                             console.log(err);
//                         })
//                 }

//             }
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

exports.create = (req, res) => {

    const emailJobObj = {
        ticketId: req.body.ticketId,
        email: req.body.email,
        isEmailSend: req.body.isEmailSend,
        escalationLevel: req.body.escalationLevel
    };

    EmailJobs.create(emailJobObj)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating.",
            });
        });
};
exports.findAll = async (req, res) => {
    await EmailJobs.findAll({
        where: { [Op.and]: [{ isEmailSend: false }, { email: null }] }, include: { all: true, nested: true },order: [['createdAt', 'DESC']],limit : 20
    })
        .then(async (data) => {
            for (let emailJobs of data) {
                let apiPath = null;
                let emailTo = null;
                let emailToName = null;
                let previousLevelsEmail = [];
                let currentAssigneeEmail = null;

                await User.findByPk(emailJobs.ticket.assigneeId)
                    .then(async (userResp) => {
                        currentAssigneeEmail = userResp.email;
                    })
                    .catch((err) => {
                        console.log(err);
                    })


                //Start-Modify the api url based on office type
                if (constants.COLLEGE_TYPES.includes(emailJobs.ticket.schCol.toLowerCase())) {
                    apiPath = "api/collegeEscalation/getCollegeEscalationAssignee";
                } else if (constants.SCHOOL_TYPES.includes(emailJobs.ticket.schCol.toLowerCase())) {
                    apiPath = "api/schoolEscalation/getSchoolEscalationAssignee";
                } else if (constants.ADMIN_TYPES.includes(emailJobs.ticket.schCol.toLowerCase())) {
                    apiPath = "api/administrativeEscalation/getAdministrativeEscalationAssignee";
                }
                //End-Modify the api url based on office type

                //Start-Fetch all details from escalation matrix
                if (apiPath) {
                    await axios.post(constants.baseUrl + apiPath, { "department": emailJobs.ticket.department.departmentName, "module": emailJobs.ticket.helptopic.module, "openDepartmentId": emailJobs.ticket.user.openDepartmentId })
                        .then(async (escResp) => {
                            if (emailJobs.escalationLevel.toLowerCase().includes("level1")) {
                                //Start-Add all the previous level emails to include them in cc 
                                if (emailJobs.ticket.emailsInvolvedInTicket !== null) {
                                    previousLevelsEmail.push(emailJobs.ticket.emailsInvolvedInTicket);
                                }
                                let ccEmails = previousLevelsEmail.join();
                                //End-Add all the previous level emails to include them in cc 
                                if (escResp.data.l1email != null && escResp.data.l1email != 0 && escResp.data.l1email != "") {
                                    emailTo = escResp.data.l1email;
                                    emailToName = escResp.data.l1name;
                                    let emailTriggerResp = exports.processEmailTemplate(emailJobs.ticketId, emailJobs.ticket.dynamicFormJson, emailToName, emailJobs.id, emailTo, ccEmails);
                                    //Start-Update SLA due date/time for next level in ticket.
                                    if (escResp.data.l2email != null && escResp.data.l2email != 0 && escResp.data.l2email != "") {
                                        let level2SlaDue;
                                        level2SlaDue = emailJobs.ticket.level1SlaDue;
                                        level2SlaDue.setMinutes(level2SlaDue.getMinutes() + 1440);//SLA will trigger every 24 hours once reached L2
                                        await Tickets.update({ level2SlaDue: `${level2SlaDue}`, level1SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL2 TIME" + level2SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level2", escResp.data.l2email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level2", emailJobs.ticketId, escResp.data.l2name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.l3email != null && escResp.data.l3email != 0 && escResp.data.l3email != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let level3SlaDue;

                                        level3SlaDue = emailJobs.ticket.level1SlaDue;
                                        level3SlaDue.setMinutes(level3SlaDue.getMinutes() + 1440);//SLA will trigger every 24 hours once reached L2
                                        await Tickets.update({ level2SlaDue: `${level3SlaDue}`, level3SlaDue: `${level3SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL3 TIME" + level3SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level3", escResp.data.l3email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level3", emailJobs.ticketId, escResp.data.l3name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.l4email != null && escResp.data.l4email != 0 && escResp.data.l4email != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let level4SlaDue;
                                        level4SlaDue = emailJobs.ticket.level1SlaDue;
                                        level4SlaDue.setMinutes(level4SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level2SlaDue: `${level4SlaDue}`, level3SlaDue: `${level4SlaDue}`, level4SlaDue: `${level4SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL4 TIME" + level4SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level4", escResp.data.l4email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level4", emailJobs.ticketId, escResp.data.l4name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.l5email != null && escResp.data.l5email != 0 && escResp.data.l5email != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let level5SlaDue;
                                        level5SlaDue = emailJobs.ticket.level1SlaDue;
                                        level5SlaDue.setMinutes(level5SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level2SlaDue: `${level5SlaDue}`, level3SlaDue: `${level5SlaDue}`, level4SlaDue: `${level5SlaDue}`, level5SlaDue: `${level5SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL5 TIME" + level5SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level5", escResp.data.l5email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level5", emailJobs.ticketId, escResp.data.l5name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.hodemail != null && escResp.data.hodemail != 0 && escResp.data.hodemail != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let hodSlaDue;
                                        hodSlaDue = emailJobs.ticket.level1SlaDue;
                                        hodSlaDue.setMinutes(hodSlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level2SlaDue: `${hodSlaDue}`, level3SlaDue: `${hodSlaDue}`, level4SlaDue: `${hodSlaDue}`, level5SlaDue: `${hodSlaDue}`, hodSlaDue: `${hodSlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, level5SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED HOD TIME" + hodSlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "hod", escResp.data.hodemail, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("hod", emailJobs.ticketId, escResp.data.hodname);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    }
                                    //End-Update SLA due date/time for next level in ticket.
                                }

                            } else if (emailJobs.escalationLevel.toLowerCase().includes("level2")) {
                                //Start-Add all the previous level emails to include them in cc 
                                previousLevelsEmail.push(escResp.data.l1email);
                                if (emailJobs.ticket.emailsInvolvedInTicket !== null) {
                                    previousLevelsEmail.push(emailJobs.ticket.emailsInvolvedInTicket);
                                }
                                let ccEmails = previousLevelsEmail.join();
                                //End-Add all the previous level emails to include them in cc 

                                if (escResp.data.l2email != null && escResp.data.l2email != 0 && escResp.data.l2email != "") {
                                    emailTo = escResp.data.l2email;
                                    emailToName = escResp.data.l2name;
                                    let emailTriggerResp = exports.processEmailTemplate(emailJobs.ticketId, emailJobs.ticket.dynamicFormJson, emailToName, emailJobs.id, emailTo, ccEmails);
                                    //Start-Update SLA due date/time for next level in ticket.
                                    if (escResp.data.l3email != null && escResp.data.l3email != 0 && escResp.data.l3email != "") {
                                        let level3SlaDue;
                                        level3SlaDue = emailJobs.ticket.level2SlaDue;
                                        level3SlaDue.setMinutes(level3SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level3SlaDue: `${level3SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL3 TIME" + level3SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level3", escResp.data.l3email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level3", emailJobs.ticketId, escResp.data.l3name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.l4email != null && escResp.data.l4email != 0 && escResp.data.l4email != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let level4SlaDue;
                                        level4SlaDue = emailJobs.ticket.level2SlaDue;
                                        level4SlaDue.setMinutes(level4SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level3SlaDue: `${level4SlaDue}`, level4SlaDue: `${level4SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL4 TIME" + level4SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level4", escResp.data.l4email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level4", emailJobs.ticketId, escResp.data.l4name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.l5email != null && escResp.data.l5email != 0 && escResp.data.l5email != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let level5SlaDue;
                                        level5SlaDue = emailJobs.ticket.level2SlaDue;
                                        level5SlaDue.setMinutes(level5SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level3SlaDue: `${level5SlaDue}`, level4SlaDue: `${level5SlaDue}`, level5SlaDue: `${level5SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL5 TIME" + level5SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level5", escResp.data.l5email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level5", emailJobs.ticketId, escResp.data.l5name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.hodemail != null && escResp.data.hodemail != 0 && escResp.data.hodemail != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let hodSlaDue;
                                        hodSlaDue = emailJobs.ticket.level2SlaDue;
                                        hodSlaDue.setMinutes(hodSlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level3SlaDue: `${hodSlaDue}`, level4SlaDue: `${hodSlaDue}`, level5SlaDue: `${hodSlaDue}`, hodSlaDue: `${hodSlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, level5SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED HOD TIME" + hodSlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "hod", escResp.data.hodemail, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("hod", emailJobs.ticketId, escResp.data.hodname);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    }
                                    //End-Update SLA due date/time for next level in ticket.
                                }
                            } else if (emailJobs.escalationLevel.toLowerCase().includes("level3")) {
                                //Start-Add all the previous level emails to include them in cc 
                                if (escResp.data.l1email != null && escResp.data.l1email != 0 && escResp.data.l1email != "") {
                                    previousLevelsEmail.push(escResp.data.l1email);
                                }
                                if (escResp.data.l2email != null && escResp.data.l2email != 0 && escResp.data.l2email != "") {
                                    previousLevelsEmail.push(escResp.data.l2email);
                                }
                                if (emailJobs.ticket.emailsInvolvedInTicket !== null) {
                                    previousLevelsEmail.push(emailJobs.ticket.emailsInvolvedInTicket);
                                }
                                let ccEmails = previousLevelsEmail.join();
                                //End-Add all the previous level emails to include them in cc


                                if (escResp.data.l3email != null && escResp.data.l3email != 0 && escResp.data.l3email != "") {
                                    emailTo = escResp.data.l3email;
                                    emailToName = escResp.data.l3name;
                                    let emailTriggerResp = await exports.processEmailTemplate(emailJobs.ticketId, emailJobs.ticket.dynamicFormJson, emailToName, emailJobs.id, emailTo, ccEmails);
                                    //Start-Update SLA due date/time for next level in ticket.
                                    if (escResp.data.l4email != null && escResp.data.l4email != 0 && escResp.data.l4email != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let level4SlaDue;
                                        level4SlaDue = emailJobs.ticket.level3SlaDue;
                                        level4SlaDue.setMinutes(level4SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level4SlaDue: `${level4SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL4 TIME" + level4SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level4", escResp.data.l4email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level4", emailJobs.ticketId, escResp.data.l4name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.l5email != null && escResp.data.l5email != 0 && escResp.data.l5email != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let level5SlaDue;
                                        level5SlaDue = emailJobs.ticket.level3SlaDue;
                                        level5SlaDue.setMinutes(level5SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level4SlaDue: `${level5SlaDue}`, level5SlaDue: `${level5SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL5 TIME" + level5SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level5", escResp.data.l5email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level5", emailJobs.ticketId, escResp.data.l5name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.hodemail != null && escResp.data.hodemail != 0 && escResp.data.hodemail != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let hodSlaDue;
                                        hodSlaDue = emailJobs.ticket.level3SlaDue;
                                        hodSlaDue.setMinutes(hodSlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level4SlaDue: `${hodSlaDue}`, level5SlaDue: `${hodSlaDue}`, hodSlaDue: `${hodSlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, level5SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED HOD TIME" + hodSlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "hod", escResp.data.hodemail, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("hod", emailJobs.ticketId, escResp.data.hodname);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    }
                                    //End-Update SLA due date/time for next level in ticket.
                                }
                            } else if (emailJobs.escalationLevel.toLowerCase().includes("level4")) {
                                //Start-Add all the previous level emails to include them in cc 
                                if (escResp.data.l1email != null && escResp.data.l1email != 0 && escResp.data.l1email != "") {
                                    previousLevelsEmail.push(escResp.data.l1email);
                                }
                                if (escResp.data.l2email != null && escResp.data.l2email != 0 && escResp.data.l2email != "") {
                                    previousLevelsEmail.push(escResp.data.l2email);
                                }
                                if (escResp.data.l3email != null && escResp.data.l3email != 0 && escResp.data.l3email != "") {
                                    previousLevelsEmail.push(escResp.data.l3email);
                                }
                                if (emailJobs.ticket.emailsInvolvedInTicket !== null) {
                                    previousLevelsEmail.push(emailJobs.ticket.emailsInvolvedInTicket);
                                }
                                let ccEmails = previousLevelsEmail.join();
                                //End-Add all the previous level emails to include them in cc

                                if (escResp.data.l4email != null && escResp.data.l4email != 0 && escResp.data.l4email != "") {
                                    emailTo = escResp.data.l4email;
                                    emailToName = escResp.data.l4name;
                                    let emailTriggerResp = await exports.processEmailTemplate(emailJobs.ticketId, emailJobs.ticket.dynamicFormJson, emailToName, emailJobs.id, emailTo, ccEmails);
                                    //Start-Update SLA due date/time for next level in ticket.
                                    if (escResp.data.l5email != null && escResp.data.l5email != 0 && escResp.data.l5email != "") {
                                        //Set level4 SLA triggered to 1 as details not present.
                                        let level5SlaDue;
                                        level5SlaDue = emailJobs.ticket.level4SlaDue;
                                        level5SlaDue.setMinutes(level5SlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level5SlaDue: `${level5SlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED LEVEL5 TIME" + level5SlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "level5", escResp.data.l5email, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("level5", emailJobs.ticketId, escResp.data.l5name);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    } else if (escResp.data.hodemail != null && escResp.data.hodemail != 0 && escResp.data.hodemail != "") {
                                        //Set level5 SLA triggered to 1 as details not present.
                                        let hodSlaDue;
                                        hodSlaDue = emailJobs.ticket.level4SlaDue;
                                        hodSlaDue.setMinutes(hodSlaDue.getMinutes() + 1440);
                                        await Tickets.update({ level5SlaDue: `${hodSlaDue}`, hodSlaDue: `${hodSlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, level5SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED HOD TIME" + hodSlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "hod", escResp.data.hodemail, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("hod", emailJobs.ticketId, escResp.data.hodname);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    }
                                    //End-Update SLA due date/time for next level in ticket.
                                }
                            } else if (emailJobs.escalationLevel.toLowerCase().includes("level5")) {
                                //Start-Add all the previous level emails to include them in cc 
                                if (escResp.data.l1email != null && escResp.data.l1email != 0 && escResp.data.l1email != "") {
                                    previousLevelsEmail.push(escResp.data.l1email);
                                }
                                if (escResp.data.l2email != null && escResp.data.l2email != 0 && escResp.data.l2email != "") {
                                    previousLevelsEmail.push(escResp.data.l2email);
                                }
                                if (escResp.data.l3email != null && escResp.data.l3email != 0 && escResp.data.l3email != "") {
                                    previousLevelsEmail.push(escResp.data.l3email);
                                }
                                if (escResp.data.l4email != null && escResp.data.l4email != 0 && escResp.data.l4email != "") {
                                    previousLevelsEmail.push(escResp.data.l4email);
                                }
                                if (emailJobs.ticket.emailsInvolvedInTicket !== null) {
                                    previousLevelsEmail.push(emailJobs.ticket.emailsInvolvedInTicket);
                                }
                                let ccEmails = previousLevelsEmail.join();
                                //End-Add all the previous level emails to include them in cc

                                if (escResp.data.l5email != null && escResp.data.l5email != 0 && escResp.data.l5email != "") {
                                    emailTo = escResp.data.l5email;
                                    emailToName = escResp.data.l5name;
                                    let emailTriggerResp = await exports.processEmailTemplate(emailJobs.ticketId, emailJobs.ticket.dynamicFormJson, emailToName, emailJobs.id, emailTo, ccEmails);
                                    //Start-Update SLA due date/time for next level in ticket.
                                    if (escResp.data.hodemail != null && escResp.data.hodemail != 0 && escResp.data.hodemail != "") {
                                        //Set all previous level SLA triggered to 1 as details not present or already executed.
                                        let hodSlaDue;
                                        hodSlaDue = emailJobs.ticket.level5SlaDue;
                                        hodSlaDue.setMinutes(hodSlaDue.getMinutes() + 1440);
                                        await Tickets.update({ hodSlaDue: `${hodSlaDue}`, level1SlaTriggered: 1, level2SlaTriggered: 1, level3SlaTriggered: 1, level4SlaTriggered: 1, level5SlaTriggered: 1, isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                            .then(async (ticUpdate) => {
                                                console.log("MODIFIED HOD TIME" + hodSlaDue);
                                                let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "hod", escResp.data.hodemail, currentAssigneeEmail);
                                                let maintainThreadResponse = await exports.maintainTicketThread("hod", emailJobs.ticketId, escResp.data.hodname);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                    }
                                    //End-Update SLA due date/time for next level in ticket.
                                }
                            } else if (emailJobs.escalationLevel.toLowerCase().includes("hod")) {
                                //Start-Add all the previous level emails to include them in cc 
                                if (escResp.data.l1email != null && escResp.data.l1email != 0 && escResp.data.l1email != "") {
                                    previousLevelsEmail.push(escResp.data.l1email);
                                }
                                if (escResp.data.l2email != null && escResp.data.l2email != 0 && escResp.data.l2email != "") {
                                    previousLevelsEmail.push(escResp.data.l2email);
                                }
                                if (escResp.data.l3email != null && escResp.data.l3email != 0 && escResp.data.l3email != "") {
                                    previousLevelsEmail.push(escResp.data.l3email);
                                }
                                if (escResp.data.l4email != null && escResp.data.l4email != 0 && escResp.data.l4email != "") {
                                    previousLevelsEmail.push(escResp.data.l4email);
                                }
                                if (escResp.data.l5email != null && escResp.data.l5email != 0 && escResp.data.l5email != "") {
                                    previousLevelsEmail.push(escResp.data.l5email);
                                }
                                if (emailJobs.ticket.emailsInvolvedInTicket !== null) {
                                    previousLevelsEmail.push(emailJobs.ticket.emailsInvolvedInTicket);
                                }
                                let ccEmails = previousLevelsEmail.join();
                                //End-Add all the previous level emails to include them in cc

                                if (escResp.data.hodemail != null && escResp.data.hodemail != 0 && escResp.data.hodemail != "") {
                                    emailTo = escResp.data.hodemail;
                                    emailToName = escResp.data.hodname;
                                    await Tickets.update({ isTicketOverdue: 'Yes' }, { where: { id: emailJobs.ticketId } })
                                        .then(async (ticUpdate) => {
                                            console.log("Updated ticket status to " + constants.lbl_OVERDUE_TICKET_STATUS);
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                    // let insertIntoEscalatedTickResp = await exports.insertEntryIntoEscalatedTickets(emailJobs.ticketId, "hod", "NA", currentAssigneeEmail);
                                    let emailTriggerResp = await exports.processEmailTemplate(emailJobs.ticketId, emailJobs.ticket.dynamicFormJson, emailToName, emailJobs.id, emailTo, ccEmails);
                                }
                            }
                            // console.log(escResp);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                //End-Fetch all details from escalation matrix

            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating.",
            });
        });
}
exports.maintainTicketThread = async (escalatedLevel, ticketId, escalatedPersonName) => {
    await Tickets.findOne({ where: { id: ticketId } })
        .then(async (ticRes) => {

            /*Note: If previous level due date is same as current escalation
             level then it simply means that previous level doesn't exist and 
             we have explicitly added that time from code.*/
            let escalatedTime;
            if (escalatedLevel.toLowerCase().includes("level2")) {
                escalatedTime = ticRes.level1SlaDue; //Previous level escalation time.
            } else if (escalatedLevel.toLowerCase().includes("level3")) {
                //Check for previous time in reverse order
                if (ticRes.level2SlaDue != null && (ticRes.level3SlaDue.getTime() != ticRes.level2SlaDue.getTime())) {
                    escalatedTime = ticRes.level2SlaDue;
                } else if (ticRes.level1SlaDue != null && (ticRes.level3SlaDue.getTime() != ticRes.level1SlaDue.getTime())) {
                    escalatedTime = ticRes.level1SlaDue;
                }

            } else if (escalatedLevel.toLowerCase().includes("level4")) {
                //Check for previous time in reverse order
                if (ticRes.level3SlaDue != null && (ticRes.level4SlaDue.getTime() != ticRes.level3SlaDue.getTime())) {
                    escalatedTime = ticRes.level3SlaDue;
                } else if (ticRes.level2SlaDue != null && (ticRes.level4SlaDue.getTime() != ticRes.level2SlaDue.getTime())) {
                    escalatedTime = ticRes.level2SlaDue;
                } else if (ticRes.level1SlaDue != null && (ticRes.level4SlaDue.getTime() != ticRes.level1SlaDue.getTime())) {
                    escalatedTime = ticRes.level1SlaDue;
                }

            } else if (escalatedLevel.toLowerCase().includes("level5")) {
                //Check for previous time in reverse order
                if (ticRes.level4SlaDue != null && (ticRes.level5SlaDue.getTime() != ticRes.level4SlaDue.getTime())) {
                    escalatedTime = ticRes.level4SlaDue;
                } else if (ticRes.level3SlaDue != null && (ticRes.level5SlaDue.getTime() != ticRes.level3SlaDue.getTime())) {
                    escalatedTime = ticRes.level3SlaDue;
                } else if (ticRes.level2SlaDue != null && (ticRes.level5SlaDue.getTime() != ticRes.level2SlaDue.getTime())) {
                    escalatedTime = ticRes.level2SlaDue;
                } else if (ticRes.level1SlaDue != null && (ticRes.level5SlaDue.getTime() != ticRes.level1SlaDue.getTime())) {
                    escalatedTime = ticRes.level1SlaDue;
                }
            } else if (escalatedLevel.toLowerCase().includes("hod")) {
                //Check for previous time in reverse order
                if (ticRes.level5SlaDue != null && (ticRes.hodSlaDue.getTime() != ticRes.level5SlaDue.getTime())) {
                    escalatedTime = ticRes.level5SlaDue;
                }
                else if (ticRes.level4SlaDue != null && (ticRes.hodSlaDue.getTime() != ticRes.level4SlaDue.getTime())) {
                    escalatedTime = ticRes.level4SlaDue;
                } else if (ticRes.level3SlaDue != null && (ticRes.hodSlaDue.getTime() != ticRes.level3SlaDue.getTime())) {
                    escalatedTime = ticRes.level3SlaDue;
                } else if (ticRes.level2SlaDue != null && (ticRes.hodSlaDue.getTime() != ticRes.level2SlaDue.getTime())) {
                    escalatedTime = ticRes.level2SlaDue;
                } else if (ticRes.level1SlaDue != null && (ticRes.hodSlaDue.getTime() != ticRes.level1SlaDue.getTime())) {
                    escalatedTime = ticRes.level1SlaDue;
                }
            }

            let msgBody = constants.lbl_ESCALATE_TICKET;
            let EmailmapObj = {
                "%{fullName}": escalatedPersonName,
                "%{level}": escalatedLevel
            };
            msgBody = msgBody.replace(/%{fullName}|%{level}|}/gi, function (matched) {
                return EmailmapObj[matched];
            });
            let htmlMessage = msgBody;
            generalMethodsController.maintainTicketThread("System", null, htmlMessage, null, ticketId, null, escalatedTime, true, false);
        })
        .catch((err) => {
            console.log(err);
        })
}
exports.processEmailTemplate = async (ticketId, dynamicFormJson, emailToName, emailJobsId, emailTo, ccReceipents) => {
    let baseUrl = constants.baseUrl;
    let ticketNumber = ticketId;
    let ticketSubject = "";
    let ticketDetails = "";
    let viewTicketLink = baseUrl + constants.VIEW_TICKET + ticketNumber;
    for (let i of Object.entries(dynamicFormJson)) {
        let processString = i[0].toString().toLowerCase().replace(/_/g, "");
        if (processString.includes("issuesummary")) {
            ticketSubject = i[1];
        }
        if (processString.includes("issuedetails")) {
            ticketDetails = i[1];
        }
    }
    await EmailTemplate.findByPk(constants.OVERDUE_TICKET_TEMPLATE_ID)
        .then(async (tempResp) => {
            let emailSubject = tempResp.subject;
            let emailBody = tempResp.emailBody;
            let EmailmapObj = {
                "%{recipient.name}": emailToName,
                "%{ticket.staff_link}": viewTicketLink,
                "%{ticket.number}": ticketNumber,
                "%{ticket.dept.manager.name}": "",//Need to confirm manager details,
            };
            emailBody = emailBody.replace(/%{recipient.name}|%{ticket.staff_link}|%{ticket.number}|%{ticket.dept.manager.name}/gi, function (matched) {
                return EmailmapObj[matched];
            });
            let sendEmailResp = await generalMethodsController.sendEmail(emailTo, emailSubject, ccReceipents, emailBody);
            await EmailJobs.update({ isEmailSend: true, email: `${emailTo}` }, { where: { id: emailJobsId } })
                .then(async (emailJobResp) => {
                    console.log("Email Jobs Updated for Id" + emailJobsId);
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })

}
exports.insertEntryIntoEscalatedTickets = async (ticketId, escalationLevel, nextLevelEmail, currentAssigneeEmail) => {
    const escalatedTicketsObj = {
        ticketId: ticketId,
        escalatedLevel: escalationLevel,
        nextLevelEmail: nextLevelEmail,
        assigneeEmail: currentAssigneeEmail,
        activeEscalationLevel: 1
    }
    await EscalatedTickets.create(escalatedTicketsObj).
        then(async (escalatedResp) => { 
            //Start--Send Lark Alert to Agent for escalated ticket.
            const ticketDetail = await Tickets.findByPk(ticketId, { include: [{ model: db.user }, { model: db.department }, { model: db.helpTopic }] });
            const ticketAssigneeDetails = await User.findByPk(ticketDetail.assigneeId);
            let ticketSubject = await generalMethodsController.getKeyFromDynamicFormJson(ticketDetail.dynamicFormJson, 'issuesummary');
            let ticketDetails = await generalMethodsController.getKeyFromDynamicFormJson(ticketDetail.dynamicFormJson, 'issuedetails');
            const larkAlertResp = await larkIntegrationController.createLarkAlerts(ticketAssigneeDetails.openId, ticketId, ticketSubject, ticketDetails, ticketDetail.department.departmentName, ticketDetail.helptopic.helpTopicName, ticketDetail.user.fullName, ticketDetail.initialCreatedDate, ticketDetail.assigneeFullName, constants.lbl_ALERT_TYPE_ESCALATED, ticketDetail.ticketStatus);
          //End--Send Lark Alert to Agent for escalated ticket.
            console.log("Escalated Ticket Details inserted into DB");
            await EscalatedTickets.findAll({ where: { [Op.and]: [{ ticketId: `${ticketId}` }] } })
                .then(async (data) => {
                    for (let d1 of data) {
                        if (d1.escalatedLevel === escalationLevel) {
                            EscalatedTickets.update({ activeEscalationLevel: 1 },
                                { where: { id: d1.id } })
                                .then((escResp) => {
                                    User.findOne({ where: { email: nextLevelEmail } })
                                        .then((userResp) => {
                                            if (userResp) {
                                                Tickets.update({ activeEscalationLevel: escalationLevel, activeEscalatedId: userResp.id }, { where: { id: ticketId } })
                                                    .then((resp) => {
                                                        console.log("Updated");
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    })
                                            } else {
                                                Tickets.update({ activeEscalationLevel: escalationLevel, activeEscalatedId: null }, { where: { id: ticketId } })
                                                    .then((resp) => {
                                                        console.log("Updated");
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    })
                                            }
                                        })
                                    console.log("Entry added in Escalated Tickets");

                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        } else {
                            EscalatedTickets.update({ activeEscalationLevel: 0 },
                                { where: { id: d1.id } })
                                .then((escResp) => {
                                    console.log("Entry Updated in Escalated Tickets");
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                })

        })
        .catch((err) => {
            console.log(err);
        })
}