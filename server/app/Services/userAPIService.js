const randomize = require('randomatic');
const db = require("../models");
const user = db.user;
const bcrypt = require("bcryptjs");
const { now } = require('moment');
const Op = db.Sequelize.Op;
const generalMethodService = require("../Services/generalMethodAPIService");
exports.getByEmail = async (email) => {
    let response = null;
    response = await user.findOne({ where: { email: email } });
    return response;
}
exports.createUser = async (email, password, isEmailVerified, firstName, lastName, mobile, designation, role, tenantid) => {

    let response = null;
    const obj = {
        email: email,
        password: password,
        is_email_verified: isEmailVerified,
        first_name: firstName,
        last_name: lastName,
        mobile: mobile,
        designation: designation,
        role: role,
        is_active: true,
        last_login_dt: now(),
        tenant_id: tenantid
    }
    await user.create(obj);
    response = await this.getByEmail(email);
    return response;
}
exports.getUserById = async (id) => {
    return user.findOne(({ where: { id: id } }));
}
exports.updateUser = async (id, updateObj, tenantid) => {
    await user.update(updateObj, { where: { [Op.and]: [{ id: id }, { tenant_id: tenantid }] } });
    return this.getUserById(id);
}
exports.getUserByResetTokenId = async (resetTokenId) => {
    return user.findOne(({ where: { reset_password_id: resetTokenId } }));
}
exports.getAllUsersWithPagination = async (page, size, tenantid) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(page, size);
    await user.findAndCountAll({ limit, offset, where: { tenant_id: tenantid } })
        .then(async (data) => {
            const res = await generalMethodService.getPagingData(data, page, limit);
            response = res;
        })
    return response;
}
exports.getUserByIdWithTenant = async (id, tenantId) => {
    return user.findOne(({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } }));
}