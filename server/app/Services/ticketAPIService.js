const db = require("../models");
const ticketHistory = db.ticketHistory;
const comment = db.comments;
const ticket = db.ticket;
const emailTemplates = require("../emailTemplates/emailTemplate");
const coreSettingsService = require("./coreSettingAPIService");
const emailAPIService = require("./emailAPIService");
const fileAPIService = require("./fileAPIService");
const generalMethodAPIService = require("./generalMethodAPIService");
const { user, ticketFiles, comments } = require("../models");
const Op = db.Sequelize.Op;
const queries = require("../constants/queries");
const constants = require("../constants/constants");
const { htmlToText } = require('html-to-text');
const { VIEW_TICKET } = require("../constants/constants");

exports.saveTicketHistory = async (tenantId, ticketId, text) => {
    let response = null;
    const reqObj = {
        plain_text: text,
        ticket_id: ticketId,
        tenant_id: tenantId
    }

    await ticketHistory.create(reqObj).then(async (resp) => {
        response = resp;
    })
    return response;
}
exports.getTicketHistoryMessage = async (type, userName, status, assignee, changedValue) => {
    let response = null;
    switch (type) {
        case "newTicket":
            response = `${userName} created the Ticket`
            break;
        case "status":
            response = `${userName} changed the Status to '${changedValue}'`
            break;
        case "assignee":
            response = `${userName} changed the Assignee to '${changedValue}'`
            break;
        case "issueDetails":
            response = `${userName} changed the Issue Details to  '${changedValue}'`
            break;
        case "issueSummary":
            response = `${userName} changed the Issue Summary to  '${changedValue}'`
            break;
        case "files":
            response = `${userName} attached new file  '${changedValue.original_name}'`
            break;
        case "category":
            response = `${userName} changed ticket Category to '${changedValue}'`
            break;
        case "priority":
            response = `${userName} changed ticket Priority to '${changedValue}'`
            break;
        case "fixVersion":
            response = `${userName} changed ticket Fix Version to '${changedValue}'`
            break;
        case "dueDate":
            response = `${userName} changed ticket Due Date to '${changedValue}'`
            break;
        case "storyPoints":
            response = `${userName} changed ticket Story Points to '${changedValue}'`
            break;
        case "resolvedBy":
            response = `${userName} changed Resolved By to '${changedValue}'`
            break;
        case "testedBy":
            response = `${userName} changed Tested By to '${changedValue}'`
            break;
        case "reviewedBy":
            response = `${userName} changed Reviewed By to '${changedValue}'`
            break;
        default:
        // code block
    }

    return response;
}
exports.saveComments = async (userDetails, tenantId, ticketId, htmlComment,emailIds) => {
    let response = null;
    const reqObj = {
        created_by: userDetails.id,
        html_text: htmlComment,
        plain_text: htmlToText(htmlComment),
        ticket_id: ticketId,
        tenant_id: tenantId,
        email_id: emailIds
    }

    await comment.create(reqObj).then(async (resp) => {
        response = resp;
    })
    return response;
}
exports.createTicket = async (departmentId, projectId, assigneeId, category, statusId, priority, fixVersion, issueDetails, issueSummary, dueDate, storyPoints, loggedInId,
    tenantId, files) => {
    let response = null;
    const obj = {
        created_by: loggedInId,
        department_id: departmentId,
        project_id: projectId,
        assignee_id: assigneeId,
        category: category,
        status_id: statusId,
        priority: priority,
        fix_version: fixVersion,
        issue_details: issueDetails,
        issue_summary: issueSummary,
        due_dt: dueDate,
        level1SlaDue: dueDate,
        story_points: storyPoints,
        tenant_id: tenantId,
    }

    const createdTicket = await ticket.create(obj);
    const userDetails = await user.findOne({ where: { id: loggedInId } });
    const assigneeDetails = await user.findOne({where: {id: assigneeId}});

    //<Start>Insert Entry in ticket history
    await this.saveTicketHistory(tenantId, createdTicket.id, await this.getTicketHistoryMessage('newTicket', userDetails.first_name + ' ' + userDetails.last_name, null, null));
    //<End>Insert Entry in ticket history

    //<Start>Insert entry into ticketFiles table
    if (generalMethodAPIService.do_Null_Undefined_EmptyArray_Check(files) !== null) {
        for (let i of files) {
            await fileAPIService.saveTicketFiles(createdTicket.id, i.id, tenantId);
        }
    }
    //<End>Insert entry into ticketFiles table


    //<Start>Send Email for Ticket Creation
    let createEmailTemplate = emailTemplates.CREATE_TICKET_TEMPLATE;
    createEmailTemplate = createEmailTemplate.replace('{username}', userDetails.first_name);
    createEmailTemplate = createEmailTemplate.replace(/{ticketNumber}/g, createdTicket.id);
    createEmailTemplate = createEmailTemplate.replace('{url}', process.env.BASE_URL);
    createEmailTemplate = createEmailTemplate.replace('{view_ticket}', VIEW_TICKET);
    await emailAPIService.sendEmail(userDetails.email, emailTemplates.NEW_TICKET_SUBJECT, null, null, null, createEmailTemplate);
    //<End>Send Email for Ticket Creation

     //<Start>Send Email to assignee for Ticket Creation
     let createassigneeEmailTemplate = emailTemplates.UPDATE_TICKET_ASSIGNEE_TEMPLATE;
     let ticketId = createdTicket.id;
     createassigneeEmailTemplate = createassigneeEmailTemplate.replace('{username}', assigneeDetails.first_name);
     createassigneeEmailTemplate = createassigneeEmailTemplate.replace(/{ticketNumber}/g, ticketId);
     createassigneeEmailTemplate = createassigneeEmailTemplate.replace('{url}', process.env.BASE_URL);
     createassigneeEmailTemplate = createassigneeEmailTemplate.replace('{view_ticket}', VIEW_TICKET);
     await emailAPIService.sendEmail(assigneeDetails.email, emailTemplates.NEW_TICKET_SUBJECT, null, null, null, createassigneeEmailTemplate);
     //<End>Send Email to assignee for Ticket Creation
    response = {
        status: true,
        data: createdTicket
    }

    return response
}
exports.getMyTickets = async (conditionArray, userId, tenantId, limit, offset, page, searchParam) => {
    var conditions = { [Op.and]: conditionArray };
    if (searchParam !== null) {

        conditions = { [Op.and]: [{ [Op.or]: [{ id: `${searchParam}` }] }, { created_by: userId }, { tenant_id: tenantId }] }
    }
    const resp = await ticket.findAndCountAll({
        limit, offset, where: conditions, include: [
            { model: db.project },
            { model: db.department },
            { model: db.status },
            { model: db.user }
        ]
    });
    const response = generalMethodAPIService.getPagingData(resp, page, limit);
    return response;
}
exports.getAllTickets = async (conditionArray, tenantId, limit, offset, page, searchParam) => {
    var conditions = { [Op.and]: conditionArray };
    if (searchParam !== null) {
        let projectIdCondition = null;//It is mandatory so that users can get tickets based on the projects on which they are assigned
        for (let i of conditionArray) {
            if (i.project_id) {
                projectIdCondition = i;
                break;
            }
        }
        conditions = { [Op.and]: [{ [Op.or]: [{ id: `${searchParam}` }] }, { tenant_id: tenantId }, projectIdCondition] }
    }
    const resp = await ticket.findAndCountAll({
        limit, offset, where: conditions, include: [
            { model: db.project },
            { model: db.department },
            { model: db.status },
            { model: db.user }
        ]
    });
    const response = generalMethodAPIService.getPagingData(resp, page, limit);
    return response;
}
exports.getDashboardData = async (userId, tenantId) => {
    const response = {};

    //<Start--Assigned Ticket Count Query>
    let assigneTicketCountQuery = queries.GET_COUNT_OF_ASSIGNED_TICKETS;
    assigneTicketCountQuery = assigneTicketCountQuery.replace(/:tenantId/g, tenantId)
    assigneTicketCountQuery = assigneTicketCountQuery.replace(/:assigneeId/g, userId)
    const assignedTicketsCount = await generalMethodAPIService.executeRawSelectQuery(assigneTicketCountQuery);
    response.assignedTicketsCount = assignedTicketsCount[0]?.id ? assignedTicketsCount[0].id : 0;
    //<End--Assigned Ticket Count Query>

    //<Start--Blocker/Critical Tickets ASsigned Count Query>
    let assignedBlockerCountQuery = queries.GET_COUNT_OF_TODAYS__BLOCKER_TICKETS;
    assignedBlockerCountQuery = assignedBlockerCountQuery.replace(/:tenantId/g, tenantId)
    assignedBlockerCountQuery = assignedBlockerCountQuery.replace(/:assigneeId/g, userId)
    const assignedBlockerTicketCount = await generalMethodAPIService.executeRawSelectQuery(assignedBlockerCountQuery);
    response.assignedBlockerTicketCount = assignedBlockerTicketCount[0]?.id ? assignedBlockerTicketCount[0].id : 0;
    //<End--Blocker/Critical Tickets ASsigned Query>

    //<Start--Total Tickets Resolved Count Query>
    let resolvedTicketCountQuery = queries.GET_COUNT_OF_RESOLVED_TICKETS;
    resolvedTicketCountQuery = resolvedTicketCountQuery.replace(/:tenantId/g, tenantId)
    resolvedTicketCountQuery = resolvedTicketCountQuery.replace(/:resolvedBy/g, userId)
    const resolvedTicketCount = await generalMethodAPIService.executeRawSelectQuery(resolvedTicketCountQuery);
    response.resolvedTicketCount = resolvedTicketCount[0]?.id ? resolvedTicketCount[0].id : 0;
    //<End--Total Tickets Resolved Count Query>

    //<Start--Total Tickets Tested Count Query>
    let testedTicketCountQuery = queries.GET_COUNT_OF_TESTED_TICKETS;
    testedTicketCountQuery = testedTicketCountQuery.replace(/:tenantId/g, tenantId)
    testedTicketCountQuery = testedTicketCountQuery.replace(/:testedBy/g, userId)
    const testedTicketCount = await generalMethodAPIService.executeRawSelectQuery(testedTicketCountQuery);
    response.testedTicketCount = testedTicketCount[0]?.id ? testedTicketCount[0].id : 0;
    //<End--Total Tickets Tested Count Query>

    //<Start--Total Tickets Reviewed Count Query>
    let reviewedTicketCountQuery = queries.GET_COUNT_OF_REVIEWED_TICKETS;
    reviewedTicketCountQuery = reviewedTicketCountQuery.replace(/:tenantId/g, tenantId)
    reviewedTicketCountQuery = reviewedTicketCountQuery.replace(/:reviewedBy/g, userId)
    const reviewedTicketCount = await generalMethodAPIService.executeRawSelectQuery(reviewedTicketCountQuery);
    response.reviewedTicketCount = reviewedTicketCount[0]?.id ? reviewedTicketCount[0].id : 0;
    //<End--Total Tickets Reviewed Count Query>

    //<Start--Total Tickets Created By User Count Query>
    let totalTicketCreatedCountQuery = queries.GET_COUNT_OF_CREATED_TICKETS;
    totalTicketCreatedCountQuery = totalTicketCreatedCountQuery.replace(/:tenantId/g, tenantId)
    totalTicketCreatedCountQuery = totalTicketCreatedCountQuery.replace(/:createdBy/g, userId)
    const totalTicketCreatedCount = await generalMethodAPIService.executeRawSelectQuery(totalTicketCreatedCountQuery);
    response.totalTicketCreatedCount = totalTicketCreatedCount[0]?.id ? totalTicketCreatedCount[0].id : 0;
    //<End--Total Tickets Created By User Count Query>

    //<Start--To DO Ticket Count Query>
    let toDoTicketCountQuery = queries.GET_COUNT_OF_TO_DO_TICKETS;
    toDoTicketCountQuery = toDoTicketCountQuery.replace(/:assigneeId/g, userId);
    toDoTicketCountQuery = toDoTicketCountQuery.replace(/:tenantId/g, tenantId)
    const toDoTicketCount = await generalMethodAPIService.executeRawSelectQuery(toDoTicketCountQuery);
    response.toDoTicketCount = toDoTicketCount[0]?.id ? toDoTicketCount[0].id : 0;
    //<End--To DO Ticket Count Query>

    //<Start--In-Progress Ticket Count Query>
    let inProgressTicketsCountQuery = queries.GET_COUNT_OF_IN_PROGRESS_TICKETS;
    inProgressTicketsCountQuery = inProgressTicketsCountQuery.replace(/:assigneeId/g, userId);
    inProgressTicketsCountQuery = inProgressTicketsCountQuery.replace(/:tenantId/g, tenantId)
    const inProgressTicketsCount = await generalMethodAPIService.executeRawSelectQuery(inProgressTicketsCountQuery);
    response.inProgressTicketsCount = inProgressTicketsCount[0]?.id ? inProgressTicketsCount[0].id : 0;
    //<End--In-Progress Ticket Count Query>

    return response;
}
exports.getTicketById = async (userId, tenantId, ticketId) => {
    let response = null;
    const ticketResponse = await ticket.findOne({
        where: { [Op.and]: [{ id: ticketId }, { tenant_id: tenantId }] }, include: [
            { model: db.project },
            { model: db.department },
            { model: db.status },
            { model: db.user }
        ]
    });
    response = ticketResponse.dataValues;
    const createdBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: response.created_by }] } });
    response.createdBy = createdBy;

    const assigneeId = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: response.assignee_id }] } });
    response.assigneeId = assigneeId;

    const closedBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: response.closed_by }] } });
    response.closedBy = closedBy;

    const reviewedBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: response.reviewed_by }] } });
    response.reviewedBy = reviewedBy;

    const testedBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: response.tested_by }] } });
    response.testedBy = testedBy;

    const resolvedBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: response.resolved_by }] } });
    response.resolvedBy = resolvedBy;

    const ticketFilesList = await ticketFiles.findAll({
        where: { [Op.and]: [{ tenant_id: tenantId }, { ticket_id: ticketId }] }, include: [
            { model: db.uploads }
        ]
    })
    response.ticketFiles = ticketFilesList;

    return response;
}
exports.updateTicket = async (type, loggedInUserDetails, tenantId, updateObj, ticketId, changedValue) => {
    let response = null;
    let updatedTicket = null;
    if (type !== 'files') {
        updatedTicket = await ticket.update(updateObj, { where: { [Op.and]: [{ tenant_id: tenantId }, { id: ticketId }] } });
    } else {
        //<Start>Insert entry into ticketFiles table
        if (generalMethodAPIService.do_Null_Undefined_EmptyArray_Check(changedValue) !== null) {
            await fileAPIService.saveTicketFiles(ticketId, changedValue.id, tenantId);
        }
        //<End>Insert entry into ticketFiles table
    }
    if(type=== 'assignee'){
        const assigneeDetails = await user.findOne({where: {id: updateObj.assignee_id}});
        console.log(assigneeDetails.first_name);
        const TicketId = ticketId;
        //<Start>Send Email to assignee for change in assignee
        let changeassigneeEmailTemplate = emailTemplates.UPDATE_TICKET_ASSIGNEE_TEMPLATE;
        changeassigneeEmailTemplate = changeassigneeEmailTemplate.replace('{username}', assigneeDetails.first_name);
        changeassigneeEmailTemplate = changeassigneeEmailTemplate.replace(/{ticketNumber}/g, TicketId);
        changeassigneeEmailTemplate = changeassigneeEmailTemplate.replace('{url}', process.env.BASE_URL);
        changeassigneeEmailTemplate = changeassigneeEmailTemplate.replace('{view_ticket}', VIEW_TICKET);
        await emailAPIService.sendEmail(assigneeDetails.email, emailTemplates.UPDATE_TICKET_SUBJECT, null, null, null, changeassigneeEmailTemplate);
        //<End>Send Email to assignee for change in assignee

    }


    //<Start>Insert Entry in ticket history
    await this.saveTicketHistory(tenantId, ticketId, await this.getTicketHistoryMessage(type, loggedInUserDetails.first_name + ' ' + loggedInUserDetails.last_name, null, null, changedValue));
    //<End>Insert Entry in ticket history
    response = {
        status: true,
        data: updatedTicket
    }

    return response

}
exports.getTicketHistory = async (userDetails, tenantId, ticketId) => {
    let response = null
    const ticketHistoryData = await ticketHistory.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }, { ticket_id: ticketId }] } });
    response = {
        status: true,
        data: ticketHistoryData
    }
    return response;
}
exports.getTicketComments = async (userDetails, tenantId, ticketId) => {
    let response = null
    let commentsArray = [];
    const ticketCommentsData = await comments.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }, { ticket_id: ticketId }] } });
    if (ticketCommentsData !== null && ticketCommentsData.length > 0) {
        for (let i of ticketCommentsData) {
            let temp = i.dataValues;
            const userDetails = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: i.created_by }] } });
            temp.createdBy = userDetails.dataValues;
            commentsArray.push(i.dataValues);
        }
    }
    response = {
        status: true,
        data: commentsArray
    }
    return response;
}