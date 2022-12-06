const db = require("../models");
const ticketHistory = db.ticketHistory;
const comment = db.comments;
const ticket = db.ticket;
const emailTemplates = require("../emailTemplates/emailTemplate");
const coreSettingsService = require("./coreSettingAPIService");
const emailAPIService = require("./emailAPIService");
const { user } = require("../models");

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

exports.getTicketHistoryMessage = async (type, userName, status, assignee) => {
    let response = null;
    switch (type) {
        case "newTicket":
            response = `${userName} created the Ticket`
            break;
        case "statusChange":
            response = `${userName} changed the Status to ${status}`
            break;
        case "assigneeChange":
            response = `${userName} changed the Assignee to ${assignee}`
            break;
        default:
        // code block
    }

    return response;
}
exports.saveComments = async (tenantId, ticketId, plainText, htmlText, createdBy) => {
    let response = null;
    const reqObj = {
        created_by: createdBy,
        html_text: htmlText,
        plain_text: plainText,
        ticket_id: ticketId,
        tenant_id: tenantId
    }

    await comment.create(reqObj).then(async (resp) => {
        response = resp;
    })
    return response;
}
exports.createTicket = async (departmentId, projectId, assigneeId, category, statusId, priority, fixVersion, issueDetails, issueSummary, dueDate, storyPoints, loggedInId,
    tenantId) => {
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
    const userDetails= await user.findOne({where:{id:loggedInId}});

    //<Start>Insert Entry in ticket history
    await this.saveTicketHistory(tenantId,createdTicket.id,await this.getTicketHistoryMessage('newTicket',userDetails.first_name +' ' + userDetails.last_name,null,null));
    //<End>Insert Entry in ticket history


    //<Start>Send Email for Ticket Creation
    let createEmailTemplate = emailTemplates.CREATE_TICKET_TEMPLATE;
    createEmailTemplate = createEmailTemplate.replace('{username}', userDetails.first_name);
    createEmailTemplate = createEmailTemplate.replace('{ticketNumber}', createdTicket.id);
    await emailAPIService.sendEmail(userDetails.email, emailTemplates.NEW_TICKET_SUBJECT, null, null, null, createEmailTemplate);
    //<End>Send Email for Ticket Creation
    response = {
        status: true,
        data: createdTicket
    }

    return response
}
