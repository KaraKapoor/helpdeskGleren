const db = require("../models");
const Ticket = db.ticket;
const EscalatedTicket = db.escalatedTickets;
const SchoolEscalation = db.schoolEscalation;
const collegeEscalation=db.collegeEscalation;
const administrativeEscalation=db.administrativeEscalation;
const User = db.user;
const TeamLeadAssociation = db.teamLeadAssociations;
const TeamLeadAgentDeptAssociations = db.teamLeadAgentDeptAssociations;
const AgentDepartmentMapping = db.agentDepartmentMapping;
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const Op = db.Sequelize.Op;
const excel = require("exceljs");
const axios = require('axios');
const constants = require("../constants/constants");
const moment = require('moment');

exports.downloadTicketData = async (req, res) => {
  const departmentId = req.query.departmentId;
  let ticketStatus = req.query.ticketStatus;
  let isTicketOverdue = req.query.isTicketOverdue;
  let createdStartDate = req.query.startDate;
  let createdEndDate = req.query.endDate;
  let closedStartDate = req.query.closedStartDate;
  let closedEndDate = req.query.closedEndDate;
  const assigneeId = req.query.assigneeId;
  const helpTopicId = req.query.helpTopicId;
  let nonEmptyKeys = [];
  let createdDates = { createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } };
  nonEmptyKeys.push(createdDates);

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
  if (closedStartDate !== "undefined" && closedEndDate !== "undefined") {
    let closedDates = { closedDate: { [Op.between]: [`${closedStartDate}`, `${closedEndDate}`] } };
    nonEmptyKeys.push(closedDates);
  }

  if (isTicketOverdue === 'Yes') {
    let overdueJson = { "isTicketOverdue": isTicketOverdue };
    nonEmptyKeys.push(overdueJson);
  } else if (isTicketOverdue === 'No') {
    let overdueJson = { "isTicketOverdue": null };
    nonEmptyKeys.push(overdueJson);
  }

  var condition = { [Op.and]: nonEmptyKeys }
  await Ticket.findAll({
    where: condition, include: [
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
    .then(async (objs) => {
      let tickets = [];
      let dynamicFields = {};

      for (let obj of objs) {
        let assignedAgent = "";
        let userResult = await db.sequelize.query('SELECT fullName FROM users where id=? ', {
          type: db.sequelize.QueryTypes.SELECT,
          replacements: [obj.assigneeId],
        });
        console.log("USER RESULT: "+userResult);
        if (userResult!==null && userResult.length>0) {
          assignedAgent = userResult[0].fullName;
        }
        dynamicFields = {};
        let ticketSubject = "";
        let priorityLevel = "";
        for (let key of Object.entries(obj.dynamicFormJson)) {
          let search = /[_ 0-9]/g;
          let replaceWith = "";
          let processString = key[0].toString().split(search).join(replaceWith);
          dynamicFields[processString] = key[1];
          if (processString.toLocaleLowerCase().includes("issuesummary")) {
            ticketSubject = key[1];
          }
          if (processString.toLocaleLowerCase().includes("prioritylevel")) {
            priorityLevel = key[1];
          }
        }

        //start-Fetch the due date of ticket and assignee details
        let dueDate = "";
        dueDate = obj.level1SlaDue;
        // if (obj.level1SlaDue !== null && obj.level2SlaDue === null && obj.level3SlaDue === null && obj.level4SlaDue === null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level1SlaDue;
        // } else if (obj.level2SlaDue !== null && obj.level3SlaDue === null && obj.level4SlaDue === null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level2SlaDue;
        // } else if (obj.level3SlaDue !== null && obj.level4SlaDue === null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level3SlaDue;
        // } else if (obj.level4SlaDue !== null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level4SlaDue;
        // } else if (obj.level5SlaDue !== null && obj.hodSlaDue === null) {
        //   dueDate = obj.level5SlaDue;
        // } else {
        //   dueDate = obj.hodSlaDue;
        // }
        //end-Fetch the due date of ticket and assignee details

        let ticketOverDueFlag = obj.isTicketOverdue
        if (ticketOverDueFlag === null) {
          ticketOverDueFlag = "No"
        } else {
          ticketOverDueFlag = "Yes"
        }
        //Start-Fetch the escalation details
        let currentEscalationLevel = obj.activeEscalationLevel;
        let escalatedLevelName = null;
        let escalatedEmail = null;
        let escalatedMobile = null;
        let escUserResult = await db.sequelize.query('SELECT fullName,email,mobile FROM users where id=? ', {
          type: db.sequelize.QueryTypes.SELECT,
          replacements: [obj.activeEscalatedId],
        });
        if (escUserResult.length > 0) {
          escalatedLevelName = escUserResult[0].fullName;
          escalatedEmail = escUserResult[0].email;
          escalatedMobile = escUserResult[0].mobile;
        }
        //End-Fetch the escalation details
        let closedDate;
        let closedByDetails;
        let closedByUserRole;
        let teamName;

        if (obj.closedDate!==null && obj.closedById!==null) {
          console.log("USER ID"+obj.closedById);
          closedDate = moment(obj.closedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A');
          closedByDetails= await User.findByPk(obj.closedById);
          console.log(closedByDetails);
            if(closedByDetails.helpdeskRole!==null && closedByDetails.helpdeskRole!==""){
              closedByUserRole= generalMethodsController.getUserRoles(closedByDetails.helpdeskRole);
            }
          
          const teamResp = await db.sequelize.query(`select t.teamName
          from teamLead_agnt_dept_associations da, teams t
            where da.departmentId=${obj.departmentId} and da.agentId=${obj.closedById} and t.id=da.teamId;`, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        if(teamResp!=null && teamResp.length>0){
          teamName=teamResp[0].teamName;
        }

        }
        tickets.push({
          ticketNumber: obj.id,
          createdAt: moment(obj.initialCreatedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          modifiedCreatedDate: moment(obj.createdAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          subject: ticketSubject,
          from: obj.fullName,
          fromEmail: obj.email,
          fromEmployeeId: obj.employeeNo,
          mobile: obj.user.mobile,
          prioritylevel: priorityLevel,
          department: obj.department.departmentName,
          helptopic: obj.helptopic.helpTopicName,
          source: obj.ticketsource.sourceName,
          status: obj.ticketStatus,
          updatedDate: moment(obj.updatedAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          ticketDueDate: moment(dueDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          sch: obj.schCol,
          branch: obj.branch,
          ticketOverdue: ticketOverDueFlag,
          agentAssigned: assignedAgent,
          reopenCount: obj.reopenThreadCount,
          escalationLevel: currentEscalationLevel,
          satisfaction: obj.ticketSatisfaction,
          escalatedPersonName: escalatedLevelName,
          escalatedPersonEmail: escalatedEmail,
          escalatedPersonMobile: escalatedMobile,
          closedDate: closedDate,
          closedBy: obj.closedBy,
          closedByUserRole:closedByUserRole,
          teamName:teamName,
          nspiraCode: obj.nspiraCode,
          state: obj.state,
          district: obj.district,
          payrollCode: obj.payrollCode

          // formField:dynamicFields

        });
      };

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Tickets");
      worksheet.columns = [
        { header: "Ticket Number", key: "ticketNumber", width: 30 },
        { header: "Date Created", key: "createdAt", width: 30 },
        { header: "Modified Created Date", key: "modifiedCreatedDate", width: 30 },
        { header: "Subject", key: "subject", width: 30 },
        { header: "From", key: "from", width: 30 },
        { header: "From Email", key: "fromEmail", width: 30 },
        { header: "From Employee ID", key: "fromEmployeeId", width: 30 },
        { header: "Mobile", key: "mobile", width: 30 },
        { header: "Priority", key: "prioritylevel", width: 30 },
        { header: "Department", key: "department", width: 30 },
        { header: "HelpTopic", key: "helptopic", width: 30 },
        { header: "Source", key: "source", width: 30 },
        { header: "Current Status", key: "status", width: 30 },
        { header: "Last Updated", key: "updatedDate", width: 30 },
        { header: "Due Date", key: "ticketDueDate", width: 30 },
        { header: "Overdue", key: "ticketOverdue", width: 30 },
        { header: "Agent Assigned", key: "agentAssigned", width: 30 },
        { header: "Thread Count", key: "reopenCount", width: 30 },
        { header: "Escalated Level", key: "escalationLevel", width: 30 },
        { header: "Escalated Level Name", key: "escalatedPersonName", width: 30 },
        { header: "Escalated Level Email", key: "escalatedPersonEmail", width: 30 },
        { header: "Escalated Level Mobile Number", key: "escalatedPersonMobile", width: 30 },
        { header: "Branch Name", key: "branch", width: 30 },
        { header: "Sch/Col", key: "sch", width: 30 },
        { header: "Satisfactory", key: "satisfaction", width: 30 },
        { header: "Closed Date", key: "closedDate", width: 30 },
        { header: "ClosedBy", key: "closedBy", width: 30 },
        { header: "Help Desk Role", key: "closedByUserRole", width: 30 },
        { header: "Team Name", key: "teamName", width: 30 },
        { header: "Nspira Code", key: "nspiraCode", width: 30 },
        { header: "State", key: "state", width: 30 },
        { header: "District", key: "district", width: 30 },
        { header: "Payroll Code", key: "payrollCode", width: 30 },


      ];

      // Add Array Rows
      worksheet.addRows(tickets);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tickets.xlsx"
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    })
}

exports.downloadMyTicketsData = async (req, res) => {
  const departmentId = req.query.departmentId;
  let ticketStatus = req.query.ticketStatus;
  let isTicketOverdue = req.query.isTicketOverdue;
  let createdStartDate = req.query.startDate;
  let createdEndDate = req.query.endDate;
  let closedStartDate = req.query.closedStartDate;
  let closedEndDate = req.query.closedEndDate;
  let userId = req.query.loggedInUserId;
  let nonEmptyKeys = [];
  let orKeys = [];
  let createdDates = { createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } };
  nonEmptyKeys.push(createdDates);

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
  if (userId !== "undefined" && userId !== "" & userId !== null) {
    let userJson = { "userId": userId };
    orKeys.push(userJson)

    let assigneeJson = { "assigneeId": userId }
    orKeys.push(assigneeJson);
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

  var condition = { [Op.and]: nonEmptyKeys, [Op.or]: orKeys }
  await Ticket.findAll({
    where: condition, include: [
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
    .then(async (objs) => {
      let tickets = [];
      let dynamicFields = {};

      for (let obj of objs) {
        // console.log(obj)
        dynamicFields = {};
        let ticketSubject = "";
        let priorityLevel = "";
        for (let key of Object.entries(obj.dynamicFormJson)) {
          let search = /[_ 0-9]/g;
          let replaceWith = "";
          let processString = key[0].toString().split(search).join(replaceWith);
          dynamicFields[processString] = key[1];
          if (processString.toLocaleLowerCase().includes("issuesummary")) {
            ticketSubject = key[1];
          }
          if (processString.toLocaleLowerCase().includes("prioritylevel")) {
            priorityLevel = key[1];
          }
        }

        //start-Fetch the due date of ticket and assignee details
        let dueDate = "";
        dueDate = obj.level1SlaDue;
        // if (obj.level1SlaDue !== null && obj.level2SlaDue === null && obj.level3SlaDue === null && obj.level4SlaDue === null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level1SlaDue;
        // } else if (obj.level2SlaDue !== null && obj.level3SlaDue === null && obj.level4SlaDue === null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level2SlaDue;
        // } else if (obj.level3SlaDue !== null && obj.level4SlaDue === null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level3SlaDue;
        // } else if (obj.level4SlaDue !== null && obj.level5SlaDue === null && obj.hodSlaDue === null) {
        //   dueDate = obj.level4SlaDue;
        // } else if (obj.level5SlaDue !== null && obj.hodSlaDue === null) {
        //   dueDate = obj.level5SlaDue;
        // } else {
        //   dueDate = obj.hodSlaDue;
        // }
        //end-Fetch the due date of ticket and assignee details

        let ticketOverDueFlag = obj.isTicketOverdue
        if (ticketOverDueFlag === null) {
          ticketOverDueFlag = "No"
        } else {
          ticketOverDueFlag = "Yes"
        }
        //Start-Fetch the escalation details
        let currentEscalationLevel = "";
        await EscalatedTicket.findOne({ where: { [Op.and]: [{ ticketId: `${obj.id}` }, { activeEscalationLevel: 1 }] } })
          .then(async (escResp) => {
            if (escResp) {
              currentEscalationLevel = escResp.escalatedLevel;
            }
          })
          .catch((err) => {
            console.log(err);
          })

        let assignedAgent = "";
        await User.findOne({ where: { id: obj.assigneeId } })
          .then(async (userResp) => {
            if (userResp) {
              assignedAgent = userResp.fullName
            }
          })
          .catch((err) => {
            console.log(err);
          })

        let escalatedLevelName = null;
        let escalatedEmail = null;
        let escalatedMobile = null;
        if (constants.COLLEGE_TYPES.includes(obj.schCol.toLocaleLowerCase())) {
          await axios
            .post(constants.baseUrl + 'api/collegeEscalation/getCollegeEscalationAssignee', {
              "department": obj.department.departmentName,
              "module": obj.helptopic.module,
              "openDepartmentId": obj.openDepartmentIdOfUser
            })
            .then(async (escResp) => {
              if (currentEscalationLevel === "level1") {
                escalatedLevelName = escResp.data.l1name;
                escalatedEmail = escResp.data.l1email;
                escalatedMobile = escResp.data.l1mobile;
              } else if (currentEscalationLevel === "level2") {
                escalatedLevelName = escResp.data.l2name;
                escalatedEmail = escResp.data.l2email;
                escalatedMobile = escResp.data.l2mobile;

              } else if (currentEscalationLevel === "level3") {
                escalatedLevelName = escResp.data.l3name;
                escalatedEmail = escResp.data.l3email;
                escalatedMobile = escResp.data.l3mobile;
              }
              else if (currentEscalationLevel === "level4") {
                escalatedLevelName = escResp.data.l4name;
                escalatedEmail = escResp.data.l4email;
                escalatedMobile = escResp.data.l4mobile;
              }
              else if (currentEscalationLevel === "level5") {
                escalatedLevelName = escResp.data.l5name;
                escalatedEmail = escResp.data.l5email;
                escalatedMobile = escResp.data.l5mobile;
              }
              else if (currentEscalationLevel === "hod") {
                escalatedLevelName = escResp.data.hodname;
                escalatedEmail = escResp.data.hodemail;
                escalatedMobile = escResp.data.hodmobile;
              }
            })
            .catch((err) => {
              console.log(err);
            })
        } else if (constants.SCHOOL_TYPES.includes(obj.schCol.toLocaleLowerCase())) {
          await axios
            .post(constants.baseUrl + 'api/schoolEscalation/getSchoolEscalationAssignee', {
              "department": obj.department.departmentName,
              "module": obj.helptopic.module,
              "openDepartmentId": obj.openDepartmentIdOfUser
            })
            .then(async (escResp) => {
              if (currentEscalationLevel === "level1") {
                escalatedLevelName = escResp.data.l1name;
                escalatedEmail = escResp.data.l1email;
                escalatedMobile = escResp.data.l1mobile;
              } else if (currentEscalationLevel === "level2") {
                escalatedLevelName = escResp.data.l2name;
                escalatedEmail = escResp.data.l2email;
                escalatedMobile = escResp.data.l2mobile;

              } else if (currentEscalationLevel === "level3") {
                escalatedLevelName = escResp.data.l3name;
                escalatedEmail = escResp.data.l3email;
                escalatedMobile = escResp.data.l3mobile;
              }
              else if (currentEscalationLevel === "level4") {
                escalatedLevelName = escResp.data.l4name;
                escalatedEmail = escResp.data.l4email;
                escalatedMobile = escResp.data.l4mobile;
              }
              else if (currentEscalationLevel === "level5") {
                escalatedLevelName = escResp.data.l5name;
                escalatedEmail = escResp.data.l5email;
                escalatedMobile = escResp.data.l5mobile;
              }
              else if (currentEscalationLevel === "hod") {
                escalatedLevelName = escResp.data.hodname;
                escalatedEmail = escResp.data.hodemail;
                escalatedMobile = escResp.data.hodmobile;
              }
            })
            .catch((err) => {
              console.log(err);
            })

        } else if (constants.ADMIN_TYPES.includes(obj.schCol.toLocaleLowerCase())) {
          await axios
            .post(constants.baseUrl + 'api/administrativeEscalation/getAdministrativeEscalationAssignee', {
              "department": obj.department.departmentName,
              "module": obj.helptopic.module,
              "openDepartmentId": obj.openDepartmentIdOfUser
            })
            .then(async (escResp) => {
              if (currentEscalationLevel === "level1") {
                escalatedLevelName = escResp.data.l1name;
                escalatedEmail = escResp.data.l1email;
                escalatedMobile = escResp.data.l1mobile;
              } else if (currentEscalationLevel === "level2") {
                escalatedLevelName = escResp.data.l2name;
                escalatedEmail = escResp.data.l2email;
                escalatedMobile = escResp.data.l2mobile;

              } else if (currentEscalationLevel === "level3") {
                escalatedLevelName = escResp.data.l3name;
                escalatedEmail = escResp.data.l3email;
                escalatedMobile = escResp.data.l3mobile;
              }
              else if (currentEscalationLevel === "level4") {
                escalatedLevelName = escResp.data.l4name;
                escalatedEmail = escResp.data.l4email;
                escalatedMobile = escResp.data.l4mobile;
              }
              else if (currentEscalationLevel === "level5") {
                escalatedLevelName = escResp.data.l5name;
                escalatedEmail = escResp.data.l5email;
                escalatedMobile = escResp.data.l5mobile;
              }
              else if (currentEscalationLevel === "hod") {
                escalatedLevelName = escResp.data.hodname;
                escalatedEmail = escResp.data.hodemail;
                escalatedMobile = escResp.data.hodmobile;
              }
            })
            .catch((err) => {
              console.log(err);
            })

        }

        //End-Fetch the escalation details
        let closedDate;
        let closedByDetails;
        let closedByUserRole="";
        let teamName;
        if (obj.closedDate !== null && obj.closedById !== null) {
          closedDate = moment(obj.closedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A')
          closedByDetails = await User.findByPk(obj.closedById);
          if (closedByDetails.helpdeskRole !== null && closedByDetails.helpdeskRole !== "") {
            closedByUserRole = generalMethodsController.getUserRoles(closedByDetails.helpdeskRole);
          }
          const teamResp = await db.sequelize.query(`select t.teamName
          from teamLead_agnt_dept_associations da, teams t
            where da.departmentId=${obj.departmentId} and da.agentId=${obj.closedById} and t.id=da.teamId;`, {
            type: db.sequelize.QueryTypes.SELECT,
          });
          if (teamResp !== null && teamResp.length>0) {
            teamName = teamResp[0].teamName;
          }
        }

        tickets.push({
          ticketNumber: obj.id,
          createdAt: moment(obj.initialCreatedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          modifiedCreatedDate: moment(obj.createdAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          subject: ticketSubject,
          from: obj.fullName,
          fromEmail: obj.email,
          fromEmployeeId: obj.employeeNo,
          mobile: obj.user.mobile,
          prioritylevel: priorityLevel,
          department: obj.department.departmentName,
          helptopic: obj.helptopic.helpTopicName,
          source: obj.ticketsource.sourceName,
          status: obj.ticketStatus,
          updatedDate: moment(obj.updatedAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          ticketDueDate: moment(dueDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          sch: obj.schCol,
          branch: obj.branch,
          ticketOverdue: ticketOverDueFlag,
          agentAssigned: assignedAgent,
          reopenCount: obj.reopenThreadCount,
          escalationLevel: currentEscalationLevel,
          satisfaction: obj.ticketSatisfaction,
          escalatedPersonName: escalatedLevelName,
          escalatedPersonEmail: escalatedEmail,
          escalatedPersonMobile: escalatedMobile,
          closedDate: closedDate,
          closedBy: obj.closedBy,
          closedByUserRole: closedByUserRole,
          teamName:teamName,
          nspiraCode: obj.nspiraCode,
          payrollCode: obj.payrollCode,
          state: obj.state,
          district: obj.district

          // formField:dynamicFields

        });
      };

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Tickets");
      worksheet.columns = [
        { header: "Ticket Number", key: "ticketNumber", width: 30 },
        { header: "Date Created", key: "createdAt", width: 30 },
        { header: "Modified Created Date", key: "modifiedCreatedDate", width: 30 },
        { header: "Subject", key: "subject", width: 30 },
        { header: "From", key: "from", width: 30 },
        { header: "From Email", key: "fromEmail", width: 30 },
        { header: "From Employee ID", key: "fromEmployeeId", width: 30 },
        { header: "Mobile", key: "mobile", width: 30 },
        { header: "Priority", key: "prioritylevel", width: 30 },
        { header: "Department", key: "department", width: 30 },
        { header: "HelpTopic", key: "helptopic", width: 30 },
        { header: "Source", key: "source", width: 30 },
        { header: "Current Status", key: "status", width: 30 },
        { header: "Last Updated", key: "updatedDate", width: 30 },
        { header: "Due Date", key: "ticketDueDate", width: 30 },
        { header: "Overdue", key: "ticketOverdue", width: 30 },
        { header: "Agent Assigned", key: "agentAssigned", width: 30 },
        { header: "Thread Count", key: "reopenCount", width: 30 },
        { header: "Escalated Level", key: "escalationLevel", width: 30 },
        { header: "Escalated Level Name", key: "escalatedPersonName", width: 30 },
        { header: "Escalated Level Email", key: "escalatedPersonEmail", width: 30 },
        { header: "Escalated Level Mobile Number", key: "escalatedPersonMobile", width: 30 },
        { header: "Branch Name", key: "branch", width: 30 },
        { header: "Sch/Col", key: "sch", width: 30 },
        { header: "Satisfactory", key: "satisfaction", width: 30 },
        { header: "Closed Date", key: "closedDate", width: 30 },
        { header: "ClosedBy", key: "closedBy", width: 30 },
        { header: "Help Desk Role", key: "closedByUserRole", width: 30 },
        { header: "Team Name", key: "teamName", width: 30 },
        { header: "Nspira Code", key: "nspiraCode", width: 30 },
        { header: "State", key: "state", width: 30 },
        { header: "District", key: "district", width: 30 },
        { header: "Payroll Code", key: "payrollCode", width: 30 },

      ];

      // Add Array Rows
      worksheet.addRows(tickets);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tickets.xlsx"
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    })
}

exports.downloadEscalatedTickets = async (req, res) => {
  const loggedInUserEmail = req.query.loggedInUserEmail;
  let ticketStatus = req.query.ticketStatus;
  let createdStartDate = req.query.startDate;
  let createdEndDate = req.query.endDate;
  //Start-Condition One- (With Status "All")
  if (ticketStatus === "All" || ticketStatus === '') {
    var condition = { [Op.or]: [{ nextLevelEmail: `${loggedInUserEmail}` }, { assigneeEmail: `${loggedInUserEmail}` }], [Op.and]: [{ '$ticket.createdAt$': { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } }] }
  }
  //End- Condtion One

  //Start-Condition Two- (With Custom Status Only)
  else {
    const status = ticketStatus.split(",");
    var condition = { [Op.or]: [{ nextLevelEmail: `${loggedInUserEmail}` }, { assigneeEmail: `${loggedInUserEmail}` }], [Op.and]: [{ '$ticket.ticketStatus$': { [Op.in]: status } }, { '$ticket.createdAt$': { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } }] }
  }
  //End- Condtion Two

  await EscalatedTicket.findAll({
    where: condition, include: [
      {
        model: db.ticket,
        include: [db.department]
      },
    ]
  })
    .then(async (data) => {
      // console.log(data);
      /**Start-Sort the tickets and show only latest escalation level */
      let sortedArray = [];
      for (let i of data) {
        if (sortedArray.length === 0) {
          sortedArray.push(i);
        } else {
          let isValueExist = sortedArray.find((d) => d.ticketId === i.ticketId);
          if (!isValueExist) {
            sortedArray.push(i);
          }
          for (let j of sortedArray) {
            if (j.ticketId === i.ticketId && (i.id > j.id)) {
              let index = sortedArray.indexOf(j);
              sortedArray.splice(index, 1);
              sortedArray.push(i);
            }
          }
        }
      }

      let tickets = [];
      for (let obj of sortedArray) {
        let ticketSubject = "";

        for (let key of Object.entries(obj.ticket.dynamicFormJson)) {
          let search = /[_ 0-9]/g;
          let replaceWith = "";
          let processString = key[0].toString().split(search).join(replaceWith);
          if (processString.toLocaleLowerCase().includes("issuesummary")) {
            ticketSubject = key[1];
          }
        }

        let closedDate;
        let closedByDetails;
        let closedByUserRole="";
        let teamName;

        if (obj.ticket.closedDate !== null && obj.ticket.closedById !== null) {
          closedDate = moment(obj.ticket.closedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A');
          closedByDetails = await User.findByPk(obj.ticket.closedById);
          if (closedByDetails.helpdeskRole !== null && closedByDetails.helpdeskRole !== "") {
            closedByUserRole = generalMethodsController.getUserRoles(closedByDetails.helpdeskRole);
          }
          const teamResp = await db.sequelize.query(`select t.teamName
          from teamLead_agnt_dept_associations da, teams t
            where da.departmentId=${obj.ticket.departmentId} and da.agentId=${obj.ticket.closedById} and t.id=da.teamId;`, {
            type: db.sequelize.QueryTypes.SELECT,
          });
          if (teamResp !== null && teamResp.length>0) {
            teamName = teamResp[0].teamName;
          }
        }

        tickets.push({
          ticketNumber: obj.ticketId,
          subject: ticketSubject,
          from: obj.ticket.fullName,
          department: obj.ticket.department.departmentName,
          branch: obj.ticket.branch,
          sch: obj.ticket.schCol,
          status: obj.ticket.ticketStatus,
          agentAssigned: obj.ticket.assigneeFullName,
          currentLevel: obj.escalatedLevel,
          ticketDueDate: moment(obj.ticket.level1SlaDue).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          closedDate: closedDate,
          closedByUserRole:closedByUserRole,
          teamName:teamName,
          nspiraCode: obj.ticket.nspiraCode,
          state: obj.ticket.state,
          district: obj.ticket.district,
          payrollCode: obj.ticket.payrollCode
        });
      }
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Escalated Tickets");
      worksheet.columns = [
        { header: "Ticket Number", key: "ticketNumber", width: 30 },
        { header: "Subject", key: "subject", width: 30 },
        { header: "From", key: "from", width: 30 },
        { header: "Department", key: "department", width: 30 },
        { header: "Branch", key: "branch", width: 30 },
        { header: "Sch/Col", key: "sch", width: 30 },
        { header: "Current Status", key: "status", width: 30 },
        { header: "Agent Assigned", key: "agentAssigned", width: 30 },
        { header: "Current Level", key: "currentLevel", width: 30 },
        { header: "Due Date", key: "ticketDueDate", width: 30 },
        { header: "Closed Date", key: "closedDate", width: 30 },
        { header: "Help Desk Role", key: "closedByUserRole", width: 30 },
        { header: "TeamName", key: "teamName", width: 30 },
        { header: "Nspira Code", key: "nspiraCode", width: 30 },
        { header: "State", key: "state", width: 30 },
        { header: "District", key: "district", width: 30 },
        { header: "Payroll Code", key: "payrollCode", width: 30 },

      ];
      // Add Array Rows
      worksheet.addRows(tickets);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "EscalatedTickets.xlsx"
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tickets."
      });
    })
}

exports.downloadSchoolEscalation= async(req,res) =>{

  await SchoolEscalation.findAll()
  .then(async (resp) =>{


  let schoolEscalation =[];
  for(let i of resp){
    schoolEscalation.push({
      "idschoolescalation":i.idschoolescalation,
      "branch":i.branch,
      "department":i.department,
      "module":i.module,
      "state":i.state,
      "district":i.district,
      "l1name":i.l1name,
      "l1mobile":i.l1mobile,
      "l1email":i.l1email,
      "l2name":i.l2name,
      "l2mobile":i.l2mobile,
      "l2email":i.l2email,
      "l3name":i.l3name,
      "l3mobile":i.l3mobile,
      "l3email":i.l3email,
      "l4name":i.l4name,
      "l4mobile":i.l4mobile,
      "l4email":i.l4email,
      "l5name":i.l5name,
      "l5mobile":i.l5mobile,
      "l5email":i.l5email,
      "hodname":i.hodname,
      "hodmobile":i.hodmobile,
      "hodemail":i.hodemail,
    })
  }

  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("School Escalation ");
  worksheet.columns = [
    { header: "School Escalation Id", key: "idschoolescalation", width: 30 },
    { header: "Branch", key: "branch", width: 30 },
    { header: "Department", key: "department", width: 30 },
    { header: "Module", key: "module", width: 30 },
    { header: "State", key: "state", width: 30 },
    { header: "District", key: "district", width: 30 },
    { header: "L1 name", key: "l1name", width: 30 },
    { header: "L1 mobile", key: "l1mobile", width: 30 },
    { header: "L1 email", key: "l1email", width: 30 },

    { header: "L2 name", key: "l2name", width: 30 },
    { header: "L2 mobile", key: "l2mobile", width: 30 },
    { header: "L2 email", key: "l2email", width: 30 },

    { header: "L3 name", key: "l3name", width: 30 },
    { header: "L3 mobile", key: "l3mobile", width: 30 },
    { header: "L3 email", key: "l3email", width: 30 },

    { header: "L4 name", key: "l4name", width: 30 },
    { header: "L4 mobile", key: "l4mobile", width: 30 },
    { header: "L4 email", key: "l4email", width: 30 },

    { header: "L5 name", key: "l5name", width: 30 },
    { header: "L5 mobile", key: "l5mobile", width: 30 },
    { header: "L5 email", key: "l5email", width: 30 },

    { header: "Hod name", key: "hodname", width: 30 },
    { header: "Hod mobile", key: "hodmobile", width: 30 },
    { header: "Hod email", key: "hodemail", width: 30 },
  ];
  worksheet.addRows(schoolEscalation);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "SchoolEscalation.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tickets."
    });
  })
}

exports.downloadCollegeEscalation= async(req,res) =>{

  await collegeEscalation.findAll()
  .then(async (resp) =>{


  let collegeEscalation =[];
  for(let i of resp){
    collegeEscalation.push({
      "idcollegeescalation":i.idcollegeescalation,
      "branch":i.branch,
      "department":i.department,
      "module":i.module,
      "state":i.state,
      "district":i.district,
      "l1name":i.l1name,
      "l1mobile":i.l1mobile,
      "l1email":i.l1email,
      "l2name":i.l2name,
      "l2mobile":i.l2mobile,
      "l2email":i.l2email,
      "l3name":i.l3name,
      "l3mobile":i.l3mobile,
      "l3email":i.l3email,
      "l4name":i.l4name,
      "l4mobile":i.l4mobile,
      "l4email":i.l4email,
      "l5name":i.l5name,
      "l5mobile":i.l5mobile,
      "l5email":i.l5email,
      "hodname":i.hodname,
      "hodmobile":i.hodmobile,
      "hodemail":i.hodemail,
    })
  }

  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("College Escalation ");
  worksheet.columns = [
    { header: "College Escalation Id", key: "idcollegeescalation", width: 30 },
    { header: "Branch", key: "branch", width: 30 },
    { header: "Department", key: "department", width: 30 },
    { header: "Module", key: "module", width: 30 },
    { header: "State", key: "state", width: 30 },
    { header: "District", key: "district", width: 30 },
    { header: "L1 name", key: "l1name", width: 30 },
    { header: "L1 mobile", key: "l1mobile", width: 30 },
    { header: "L1 email", key: "l1email", width: 30 },

    { header: "L2 name", key: "l2name", width: 30 },
    { header: "L2 mobile", key: "l2mobile", width: 30 },
    { header: "L2 email", key: "l2email", width: 30 },

    { header: "L3 name", key: "l3name", width: 30 },
    { header: "L3 mobile", key: "l3mobile", width: 30 },
    { header: "L3 email", key: "l3email", width: 30 },

    { header: "L4 name", key: "l4name", width: 30 },
    { header: "L4 mobile", key: "l4mobile", width: 30 },
    { header: "L4 email", key: "l4email", width: 30 },

    { header: "L5 name", key: "l5name", width: 30 },
    { header: "L5 mobile", key: "l5mobile", width: 30 },
    { header: "L5 email", key: "l5email", width: 30 },

    { header: "Hod name", key: "hodname", width: 30 },
    { header: "Hod mobile", key: "hodmobile", width: 30 },
    { header: "Hod email", key: "hodemail", width: 30 },
  ];
  worksheet.addRows(collegeEscalation);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "CollegeEscalation.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tickets."
    });
  })
}
exports.downloadAdministrativeEscalation= async(req,res) =>{

  await administrativeEscalation.findAll()
  .then(async (resp) =>{


  let administrativeEscalation =[];
  for(let i of resp){
    administrativeEscalation.push({
      "idadministrativeescalation":i.idadministrativeescalation,
      "branch":i.branch,
      "department":i.department,
      "module":i.module,
      "state":i.state,
      "district":i.district,
      "l1name":i.l1name,
      "l1mobile":i.l1mobile,
      "l1email":i.l1email,
      "l2name":i.l2name,
      "l2mobile":i.l2mobile,
      "l2email":i.l2email,
      "l3name":i.l3name,
      "l3mobile":i.l3mobile,
      "l3email":i.l3email,
      "l4name":i.l4name,
      "l4mobile":i.l4mobile,
      "l4email":i.l4email,
      "l5name":i.l5name,
      "l5mobile":i.l5mobile,
      "l5email":i.l5email,
      "hodname":i.hodname,
      "hodmobile":i.hodmobile,
      "hodemail":i.hodemail,
    })
  }

  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Administrative Escalation ");
  worksheet.columns = [
    { header: "Administrative Escalation Id", key: "idadministrativeescalation", width: 30 },
    { header: "Branch", key: "branch", width: 30 },
    { header: "Department", key: "department", width: 30 },
    { header: "Module", key: "module", width: 30 },
    { header: "State", key: "state", width: 30 },
    { header: "District", key: "district", width: 30 },
    { header: "L1 name", key: "l1name", width: 30 },
    { header: "L1 mobile", key: "l1mobile", width: 30 },
    { header: "L1 email", key: "l1email", width: 30 },

    { header: "L2 name", key: "l2name", width: 30 },
    { header: "L2 mobile", key: "l2mobile", width: 30 },
    { header: "L2 email", key: "l2email", width: 30 },

    { header: "L3 name", key: "l3name", width: 30 },
    { header: "L3 mobile", key: "l3mobile", width: 30 },
    { header: "L3 email", key: "l3email", width: 30 },

    { header: "L4 name", key: "l4name", width: 30 },
    { header: "L4 mobile", key: "l4mobile", width: 30 },
    { header: "L4 email", key: "l4email", width: 30 },

    { header: "L5 name", key: "l5name", width: 30 },
    { header: "L5 mobile", key: "l5mobile", width: 30 },
    { header: "L5 email", key: "l5email", width: 30 },

    { header: "Hod name", key: "hodname", width: 30 },
    { header: "Hod mobile", key: "hodmobile", width: 30 },
    { header: "Hod email", key: "hodemail", width: 30 },
  ];
  worksheet.addRows(administrativeEscalation);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "AdministrativeEscalation.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tickets."
    });
  })
}

exports.downloadTransferTickets = async (req, res) => {
  const loggedInUserEmail = req.query.loggedInUserEmail;
  let ticketStatus = req.query.ticketStatus;
  let createdStartDate = req.query.startDate;
  let createdEndDate = req.query.endDate;

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

  await Ticket.findAll({
    where: condition, include: [
      {
        model: db.department,
      }
    ]
  })
    .then(async (data) => {
      let tickets = [];
      for (obj of data) {
        let ticketSubject = "";

        for (let key of Object.entries(obj.dynamicFormJson)) {
          let search = /[_ 0-9]/g;
          let replaceWith = "";
          let processString = key[0].toString().split(search).join(replaceWith);
          if (processString.toLocaleLowerCase().includes("issuesummary")) {
            ticketSubject = key[1];
          }
        }
        let closedDate;
        let closedByDetails;
        let closedByUserRole="";
        let teamName;
        if (obj.closedDate!==null && obj.closedById!==null) {
          closedDate = moment(obj.closedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A');
          closedByDetails= await User.findByPk(obj.closedById);
          if (closedByDetails.helpdeskRole !== null && closedByDetails.helpdeskRole !== "") {
            closedByUserRole = generalMethodsController.getUserRoles(closedByDetails.helpdeskRole);
          }
          const teamResp = await db.sequelize.query(`select t.teamName
          from teamLead_agnt_dept_associations da, teams t
            where da.departmentId=${obj.departmentId} and da.agentId=${obj.closedById} and t.id=da.teamId;`, {
            type: db.sequelize.QueryTypes.SELECT,
          });
          if (teamResp !== null && teamResp.length>0) {
            teamName = teamResp[0].teamName;
          }
        }
        tickets.push({
          ticketNumber: obj.id,
          createdDate: moment(obj.initialCreatedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          modifiedCreatedDate: moment(obj.createdAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          subject: ticketSubject,
          from: obj.fullName,
          agentAssigned: obj.assigneeFullName,
          branch: obj.branch,
          sch: obj.schCol,
          status: obj.ticketStatus,
          department: obj.department.departmentName,
          ticketDueDate: moment(obj.level1SlaDue).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          closedDate: closedDate,
          closedByUserRole:closedByUserRole,
          teamName:teamName,
          nspiraCode: obj.nspiraCode,
          state: obj.state,
          district: obj.district,
          payrollCode: obj.payrollCode

        });
      }
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Transfer Tickets");
      worksheet.columns = [
        { header: "Ticket Number", key: "ticketNumber", width: 30 },
        { header: "Created Date", key: "createdDate", width: 30 },
        { header: "Modified Created Date", key: "modifiedCreatedDate", width: 30 },
        { header: "Subject", key: "subject", width: 30 },
        { header: "From", key: "from", width: 30 },
        { header: "Agent Assigned", key: "agentAssigned", width: 30 },
        { header: "Branch", key: "branch", width: 30 },
        { header: "Sch/Col", key: "sch", width: 30 },
        { header: "Current Status", key: "status", width: 30 },
        { header: "Department", key: "department", width: 30 },
        { header: "Initial Due Date", key: "ticketDueDate", width: 30 },
        { header: "Closed Date", key: "closedDate", width: 30 },
        { header: "Help Desk Role", key: "closedByUserRole", width: 30 },
        { header: "Team Name", key: "teamName", width: 30 },
        { header: "Nspira Code", key: "nspiraCode", width: 30 },
        { header: "State", key: "state", width: 30 },
        { header: "District", key: "district", width: 30 },
        { header: "Payroll Code", key: "payrollCode", width: 30 },

      ];
      // Add Array Rows
      worksheet.addRows(tickets);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "TransferTickets.xlsx"
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tickets."
      });
    })

}
exports.downloadMyTeamTickets = async (req, res) => {
  try {
    const departmentId = req.query.departmentId;
    let ticketStatus = req.query.ticketStatus;
    let isTicketOverdue = req.query.isTicketOverdue;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let closedStartDate = req.query.closedStartDate;
    let closedEndDate = req.query.closedEndDate;
    const assigneeId = req.query.assigneeId;
    const helpTopicId = req.query.helpTopicId;
    const teamId = req.query.teamId;
    const userId= req.query.userId;
    let teamDepartmentId=[];
    let showNestedTickets = req.query.showNestedTickets;
    let nonEmptyKeys = [];
    let createdDates = { createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } };
    nonEmptyKeys.push(createdDates);

    if (departmentId !== "undefined" && departmentId !== "" & departmentId !== null && departmentId !== "All") {
      let departJson = { "departmentId": departmentId };
      nonEmptyKeys.push(departJson);
    }
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
    if (closedStartDate !== "undefined" && closedEndDate !== "undefined") {
      let closedDates = { closedDate: { [Op.between]: [`${closedStartDate}`, `${closedEndDate}`] } };
      nonEmptyKeys.push(closedDates);
    }

    if (isTicketOverdue === 'Yes') {
      let overdueJson = { "isTicketOverdue": isTicketOverdue };
      nonEmptyKeys.push(overdueJson);
    } else if (isTicketOverdue === 'No') {
      let overdueJson = { "isTicketOverdue": null };
      nonEmptyKeys.push(overdueJson);
    }

    const teamsAssociatedAgentsResp = await getLeadAgentDeptAssociations({ teamId: teamId });
    let agentsInTeam = new Set();
    for (let i of teamsAssociatedAgentsResp) {
      teamDepartmentId.push(i.dataValues.departmentId);
      agentsInTeam.add(i.dataValues.agentId);
      if (i.dataValues.teamLeadId === parseInt(userId)) {
        agentsInTeam.add(i.dataValues.teamLeadId);//Show only current lead tickets.
      }

      if (showNestedTickets === 'true' || showNestedTickets === true) {
        //Check if agent is team lead in another team then add it's nested agents as well
        let Counter = 0;
        do {
          const myIterator = agentsInTeam.values();
          const agentsArray = [];
          for (const i of myIterator) {
            agentsArray.push(i);
          }
          currentlead = agentsArray[Counter];
          if (currentlead === parseInt(userId)) {
            Counter++;
            continue; //No need to fetch the nested teams of lead only agent is required.
          }
          const deptId = teamDepartmentId;
          const nestedTeamMembersOfLeadResp = await TeamLeadAgentDeptAssociations.findAll({ where: { [Op.and]: [{ departmentId: { [Op.in]: deptId } }, { [Op.or]: [{ teamLeadId: currentlead }] }] } });
          if (nestedTeamMembersOfLeadResp != null) {
            for (let k of nestedTeamMembersOfLeadResp) {
              agentsInTeam.add(k.dataValues.agentId);
            }
          }
          Counter++;
        } while (Counter < agentsInTeam.size)
      }
    }
    let agentsInTeamIterator = agentsInTeam.values();
    let agentsArray = [];
    for (let id of agentsInTeamIterator) {
      agentsArray.push(id);
    }
    let filterTickets = {
      [Op.or]: [
        // {
        //   userId: agentsArray
        // },
        {
          assigneeId: agentsArray
        }
      ]
    }
    nonEmptyKeys.push(filterTickets);
    var condition = { [Op.and]: nonEmptyKeys }
    await Ticket.findAll({
      where: condition, include: [
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
      .then(async (objs) => {
        let tickets = [];
        let dynamicFields = {};

        for (let obj of objs) {
          let assignedAgent = "";
          let userResult = await db.sequelize.query('SELECT fullName FROM users where id=? ', {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: [obj.assigneeId],
          });
          if (userResult) {
            assignedAgent = userResult[0].fullName;
          }
          dynamicFields = {};
          let ticketSubject = "";
          let priorityLevel = "";
          for (let key of Object.entries(obj.dynamicFormJson)) {
            let search = /[_ 0-9]/g;
            let replaceWith = "";
            let processString = key[0].toString().split(search).join(replaceWith);
            dynamicFields[processString] = key[1];
            if (processString.toLocaleLowerCase().includes("issuesummary")) {
              ticketSubject = key[1];
            }
            if (processString.toLocaleLowerCase().includes("prioritylevel")) {
              priorityLevel = key[1];
            }
          }

          //start-Fetch the due date of ticket and assignee details
          let dueDate = "";
          dueDate = obj.level1SlaDue;
          let ticketOverDueFlag = obj.isTicketOverdue
          if (ticketOverDueFlag === null) {
            ticketOverDueFlag = "No"
          } else {
            ticketOverDueFlag = "Yes"
          }
          //Start-Fetch the escalation details
          let currentEscalationLevel = obj.activeEscalationLevel;
          let escalatedLevelName = null;
          let escalatedEmail = null;
          let escalatedMobile = null;
          let escUserResult = await db.sequelize.query('SELECT fullName,email,mobile FROM users where id=? ', {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: [obj.activeEscalatedId],
          });
          if (escUserResult.length > 0) {
            escalatedLevelName = escUserResult[0].fullName;
            escalatedEmail = escUserResult[0].email;
            escalatedMobile = escUserResult[0].mobile;
          }
          //End-Fetch the escalation details
          let closedDate;
          let helpdeskRole;
          let teamName;
          if (obj.closedDate!==null && obj.closedById!==null) {
            closedDate = moment(obj.closedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A');
            closedByDetails= await User.findByPk(obj.closedById);
            if (closedByDetails.helpdeskRole !== null && closedByDetails.helpdeskRole !== "") {
              closedByUserRole = generalMethodsController.getUserRoles(closedByDetails.helpdeskRole);
            }
            helpdeskRole=closedByUserRole;
            const teamResp = await db.sequelize.query(`select t.teamName
            from teamLead_agnt_dept_associations da, teams t
              where da.departmentId=${obj.departmentId} and da.agentId=${obj.closedById} and t.id=da.teamId;`, {
              type: db.sequelize.QueryTypes.SELECT,
            });
            if (teamResp !== null && teamResp.length>0) {
              teamName = teamResp[0].teamName;
            }
          }
          tickets.push({
            ticketNumber: obj.id,
            createdAt: moment(obj.initialCreatedDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
            modifiedCreatedDate: moment(obj.createdAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
            subject: ticketSubject,
            from: obj.fullName,
            fromEmail: obj.email,
            fromEmployeeId: obj.employeeNo,
            mobile: obj.user.mobile,
            prioritylevel: priorityLevel,
            department: obj.department.departmentName,
            helptopic: obj.helptopic.helpTopicName,
            source: obj.ticketsource.sourceName,
            status: obj.ticketStatus,
            updatedDate: moment(obj.updatedAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
            ticketDueDate: moment(dueDate).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
            sch: obj.schCol,
            branch: obj.branch,
            ticketOverdue: ticketOverDueFlag,
            agentAssigned: assignedAgent,
            reopenCount: obj.reopenThreadCount,
            escalationLevel: currentEscalationLevel,
            satisfaction: obj.ticketSatisfaction,
            escalatedPersonName: escalatedLevelName,
            escalatedPersonEmail: escalatedEmail,
            escalatedPersonMobile: escalatedMobile,
            closedDate: closedDate,
            closedBy: obj.closedBy,
            helpdeskRole: helpdeskRole,
            teamName:teamName,
            nspiraCode: obj.nspiraCode,
            state: obj.state,
            district: obj.district,
            payrollCode: obj.payrollCode

            // formField:dynamicFields

          });
        };

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Tickets");
        worksheet.columns = [
          { header: "Ticket Number", key: "ticketNumber", width: 30 },
          { header: "Date Created", key: "createdAt", width: 30 },
          { header: "Modified Created Date", key: "modifiedCreatedDate", width: 30 },
          { header: "Subject", key: "subject", width: 30 },
          { header: "From", key: "from", width: 30 },
          { header: "From Email", key: "fromEmail", width: 30 },
          { header: "From Employee ID", key: "fromEmployeeId", width: 30 },
          { header: "Mobile", key: "mobile", width: 30 },
          { header: "Priority", key: "prioritylevel", width: 30 },
          { header: "Department", key: "department", width: 30 },
          { header: "HelpTopic", key: "helptopic", width: 30 },
          { header: "Source", key: "source", width: 30 },
          { header: "Current Status", key: "status", width: 30 },
          { header: "Last Updated", key: "updatedDate", width: 30 },
          { header: "Due Date", key: "ticketDueDate", width: 30 },
          { header: "Overdue", key: "ticketOverdue", width: 30 },
          { header: "Agent Assigned", key: "agentAssigned", width: 30 },
          { header: "Thread Count", key: "reopenCount", width: 30 },
          { header: "Escalated Level", key: "escalationLevel", width: 30 },
          { header: "Escalated Level Name", key: "escalatedPersonName", width: 30 },
          { header: "Escalated Level Email", key: "escalatedPersonEmail", width: 30 },
          { header: "Escalated Level Mobile Number", key: "escalatedPersonMobile", width: 30 },
          { header: "Branch Name", key: "branch", width: 30 },
          { header: "Sch/Col", key: "sch", width: 30 },
          { header: "Satisfactory", key: "satisfaction", width: 30 },
          { header: "Closed Date", key: "closedDate", width: 30 },
          { header: "ClosedBy", key: "closedBy", width: 30 },
          { header: "HelpDeskRole", key: "helpdeskRole", width: 30 },
          { header: "Team Name", key: "teamName", width: 30 },
          { header: "Nspira Code", key: "nspiraCode", width: 30 },
          { header: "State", key: "state", width: 30 },
          { header: "District", key: "district", width: 30 },
          { header: "Payroll Code", key: "payrollCode", width: 30 },


        ];

        // Add Array Rows
        worksheet.addRows(tickets);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "teamTickets.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      })
  } catch (err) {
    console.log(err);
  }

}
exports.downloadDepartmentAssociatedAgents = async (req, res) => {
  const departmentId = req.query.departmentId;
  let query = `SELECT t1.fullName,t1.email,t1.mobile,t1.employeeId,t1.designation,d1.departmentName as ServiceDeskDepartment,t1.officeType,t1.helpdeskRole
  FROM users t1
  JOIN agent_dept_Mappings t2 ON t2.userId = t1.id Join departments d1 on t2.departmentId=d1.id
  WHERE t2.userId=t1.id and d1.id=${departmentId} and  t2.departmentId=d1.id `
  const queryResp = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT,
  });
  // var condition = { [Op.and]: [{ departmentId: departmentId }] };
  try {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Associated Agents");
    worksheet.columns = [
      { header: "S.No", key: "SNo", width: 10 },
      { header: "Employee Name", key: "fullName", width: 30 },
      { header: "E-Mail Address", key: "email", width: 30 },
      { header: "Mobile Number", key: "mobile", width: 30 },
      { header: "Employee ID", key: "employeeId", width: 10 },
      { header: "Designation", key: "designation", width: 30 },
      { header: "Service Desk Department", key: "ServiceDeskDepartment", width: 30 },
      { header: "Office Type", key: "officeType", width: 30 },
      { header: "HelpDesk Role", key: "helpdeskRole", width: 30 },
    ];
    worksheet.getRow(1).font = { bold: true };
    let counter=1;
    for(let i of queryResp){
      i.SNo=counter;
      counter++;
    }
    worksheet.addRows(queryResp);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "AssociatedAgents.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (err) {
    console.log(err);
    return res.send({ success: false, message: "Some error occurred while performing the operation" });
  }
}
exports.downloadAllDepartmentsAgents = async (req, res) => {
  try {
    let query = `SELECT t1.fullName,t1.email,t1.mobile,t1.employeeId,t1.designation,d1.departmentName as ServiceDeskDepartment,t1.officeType,t1.helpdeskRole
    FROM users t1
    JOIN agent_dept_Mappings t2 ON t2.userId = t1.id Join departments d1 on t2.departmentId=d1.id
    WHERE t2.userId=t1.id and t2.departmentId=d1.id;`
    const queryResp = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("All Departments Agents");
    worksheet.columns = [
      { header: "S.No", key: "SNo", width: 10 },
      { header: "Employee Name", key: "fullName", width: 30 },
      { header: "E-mail Address", key: "email", width: 30 },
      { header: "Mobile Number", key: "mobile", width: 30 },
      { header: "Employee ID", key: "employeeId", width: 10 },
      { header: "Designation", key: "designation", width: 30 },
      { header: "Service Desk Department", key: "ServiceDeskDepartment", width: 30 },
      { header: "Office Type", key: "officeType", width: 30 },
      { header: "HelpDeskRole", key: "helpdeskRole", width: 30 },
    ];
    worksheet.getRow(1).font = { bold: true };
    let counter=1;
    for(let i of queryResp){
      i.SNo=counter;
      counter++;
    }
    worksheet.addRows(queryResp)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "AllDepartmentsAgents.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (exception) {
    console.log(err);
    return res.send({ success: false, message: "Some error occurred while performing the operation" });
  }
}
exports.downloadAllAdminTeams = async (req, res) => {
  try {
    let responseArray = [];
    let query = `select 
    t.teamName,t.createdBy,t.createdAt,t.updatedBy,t.updatedAt,ta.teamLeadId,ta.agentId
      from teams t,teamLead_agnt_dept_associations ta
    where t.id=ta.teamId;`
    const queryResp = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (queryResp !== null) {
      for (let i of queryResp) {
        const createdByDetails = await User.findByPk(i.createdBy);
        const teamLeadDetails = await User.findByPk(i.teamLeadId);
        const agentDetails = await User.findByPk(i.agentId);
        const modifiedByDetails = await User.findByPk(i.updatedBy);

        responseArray.push({
          "teamName": i.teamName,
          "createdBy": createdByDetails.fullName,
          "createdAt": moment(i.createdAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A'),
          "teamLeadName": teamLeadDetails.fullName,
          "teamLeadMobile": teamLeadDetails.mobile,
          "teamLeadEmail": teamLeadDetails.email,
          "agentName": agentDetails.fullName,
          "agentMobile": agentDetails.mobile,
          "agentEmail": agentDetails.email,
          "modifiedBy": modifiedByDetails.fullName,
          "modifiedDate": moment(i.updatedAt).utcOffset("+05:30").format('DD/MM/YYYY hh:mm A')
        })
      }

    }

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("All Teams");
    worksheet.columns = [
      { header: "Team Name", key: "teamName", width: 30 },
      { header: "Created By", key: "createdBy", width: 30 },
      { header: "Created Date & Time", key: "createdAt", width: 30 },
      { header: "Team Lead Name", key: "teamLeadName", width: 30 },
      { header: "Team Lead Mobile Number", key: "teamLeadMobile", width: 10 },
      { header: "Team Lead Email Address", key: "teamLeadEmail", width: 30 },
      { header: "Agent Name", key: "agentName", width: 30 },
      { header: "Agent Mobile Number", key: "agentMobile", width: 30 },
      { header: "Agent Email Address", key: "agentEmail", width: 30 },
      { header: "Modified By", key: "modifiedBy", width: 30 },
      { header: "Modified Date & Time", key: "modifiedDate", width: 30 },
    ];
    worksheet.getRow(1).font = { bold: true };
    worksheet.addRows(responseArray)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "AllTeams.xlsx"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (exception) {
    console.log(exception);
    return res.send({ success: false, message: "Some error occurred while performing the operation" });
  }
}
function getTeamById(id) {
  return Teams.findByPk(id);
}

function getAllTeams(limit, offset, condition, sortColumns) {
  return Teams.findAndCountAll({
    limit, offset, where: condition, order: [sortColumns],
  });
}

function saveTeam(obj) {
  return Teams.create(obj);
}

function updateTeam(obj, id) {
  return Teams.update(obj, { where: { id: id } });
}

function deleteTeam(condition) {
  return Teams.destroy({ where: condition })
}

function saveTeamLeadAssociations(obj) {
  return TeamLeadAssociation.create(obj)
}
function deleteTeamLeadAssociations(condition) {
  return TeamLeadAssociation.destroy({ where: condition })
}

function saveTeamLeadAgentDepartmentAssociations(obj) {
  return TeamLeadAgentDeptAssociations.create(obj)
}
function deleteTeamLeadAgentDepartmentAssociations(condition) {
  return TeamLeadAgentDeptAssociations.destroy({ where: condition });
}
function getLeadAgentDeptAssociations(condition) {
  return TeamLeadAgentDeptAssociations.findAll({ where: condition });
}

function getTeamLeadAssociations(condition) {
  return TeamLeadAssociation.findAll({ where: condition });
}

function getUserById(id) {
  return User.findByPk(id);
}

function containsObject(obj1, list) {
  for (let obj2 of list) {
    const obj1Length = Object.keys(obj1).length;
    const obj2Length = Object.keys(obj2).length;

    if (obj1Length === obj2Length) {
      if (Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj2[key] === obj1[key])) {
        return true;
      }
    }
  }
  return false;
}
function getDepartmentById(id) {
  return Department.findByPk(id);
}