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

exports.getSignedUrl = async (keyName) => {
    const s3Config = this.get_S3_Config();
    return s3Config.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: keyName,
        Expires: 60 * 60 * 6
    })
}
exports.get_S3_Config = () => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_S3_REGION
    })
    return s3;
}
exports.downloadFile = async(userDetails, tenantId, keyName) => {
    const fileDetails = await this.getSignedUrl(keyName);
    return fileDetails;
}
exports.downloadMultipleFile = async (
  userDetails,
  tenantId,
  attachmentData
) => {
  let data=[]
  await attachmentData.map(async (item) => {
    const fileDetails =await this.getSignedUrl(item.key);
    data.push({path:fileDetails})
  });
  return data
};
