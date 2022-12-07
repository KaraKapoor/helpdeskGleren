const db = require("../models");
const ticketFile = db.ticketFiles;

exports.saveTicketFiles = async (ticketId, uploadId, tenantId) => {

    const obj = {
        "ticket_id": ticketId,
        "upload_id": uploadId,
        "tenant_id": tenantId
    }
    return await ticketFile.create(obj);
}