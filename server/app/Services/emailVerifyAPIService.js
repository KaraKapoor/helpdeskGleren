const randomize = require('randomatic');
const db = require("../models");
const emailVerify = db.emailVerify;
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
exports.generateEmailOTP = async (email) => {
    let response = null;
    const otp = randomize('0000');
    console.log("OTP " + otp)
    const otphash = bcrypt.hashSync(otp + '', 10);
    const req = {
        email: email,
        otp_hash: otphash
    }
    await emailVerify.create(req);
    response = otp;
    return response;
}
exports.getByEmail = async (email) => {
    let response = null;
    response = await emailVerify.findOne({ where: { email: email }, order: [['createdAt', 'DESC']] });
    return response;
}
exports.getNotExpiredRecord = async (email) => {
    let response = null;
    response = await emailVerify.findOne({ where: { [Op.and]: [{ email: email }, { is_expired: false }] }, order: [['createdAt', 'DESC']] });
    return response;
}
exports.updateEmailVerify = async (data, id) => {
    await emailVerify.update(data, { where: { id: id } });
}