const randomize = require('randomatic');
const db = require("../models");
const user = db.user;
const bcrypt = require("bcryptjs");
const { now } = require('moment');
const Op = db.Sequelize.Op;
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