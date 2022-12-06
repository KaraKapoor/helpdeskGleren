const db = require("../models");
const ticketHistory = db.ticketHistory;
const comment = db.comments;

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
        case newTicket:
            response = `${userName} created the 'Ticket'`
            break;
        case statusChange:
            response = `${userName} changed the Status to '${status}'`
            break;
        case assigneeChange:
            response = `${userName} changed the Assignee to '${assignee}'`
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