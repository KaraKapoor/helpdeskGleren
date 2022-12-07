const db = require("../models");
const Op = db.Sequelize.Op;
const ticketFile = db.ticketFiles;

exports.saveTicketFiles = async (ticketId, uploadId, tenantId) => {

    const obj = {
        "ticket_id": ticketId,
        "upload_id": uploadId,
        "tenant_id": tenantId
    }
    return await ticketFile.create(obj);
}
exports.deleteTicketFiles = async (uploadId, tenantId) => {
    return await ticketFile.destroy({ where: { [Op.and]: [{ upload_id: uploadId }, { tenant_id: tenantId }] } })
}