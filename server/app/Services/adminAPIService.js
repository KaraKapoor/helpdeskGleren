
const db = require("../models");
const project = db.project;
const status = db.status;
const department = db.department;
const Op = db.Sequelize.Op;
const generalMethodService = require("../Services/generalMethodAPIService");
const emailTemplates = require("../emailTemplates/emailTemplate");
const emailAPIService = require("./emailAPIService");
const coreSettingsConstants = require("../constants/coreSettingsConstants");
const { htmlToText } = require('html-to-text');

exports.getProjectByName = async (projectName, tenantId) => {

    return await project.findOne({ where: { [Op.and]: [{ name: projectName }, { tenant_id: tenantId }] } });
}
exports.getProjectById = async (id, tenantId) => {
    return await project.findOne({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } });
}
exports.createProject = async (name, id, active, tenantId) => {
    let response = null;
    const obj = {
        name: name,
        tenant_id: tenantId,
        is_active: true
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id) !== null) {
        obj.id = id;
        obj.is_active = active;
        await project.update(obj, { where: { id: id } });
    } else {
        await project.create(obj);
    }

    const createdProject = await this.getProjectByName(name, tenantId);
    response = {
        status: true,
        data: createdProject
    }

    return response
}
exports.getAllProjectsWithPagination = async (page, size, tenantid) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(page, size);
    await project.findAndCountAll({ limit, offset, where: { tenant_id: tenantid } })
        .then(async (data) => {
            const res = await generalMethodService.getPagingData(data, page, limit);
            response = res;
        })
    return response;
}
exports.getStatusByName = async (statusName, tenantId) => {
    return await status.findOne({ where: { [Op.and]: [{ name: statusName }, { tenant_id: tenantId }] } });
}
exports.getStatusById = async (id, tenantId) => {
    return await status.findOne({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } });
}
exports.createStatus = async (name, id, active, tenantId) => {
    let response = null;
    const obj = {
        name: name,
        tenant_id: tenantId,
        is_active: true
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id) !== null) {
        obj.id = id;
        obj.is_active = active;
        await status.update(obj, { where: { id: id } });
    } else {
        await status.create(obj);
    }

    const createdStatus = await this.getStatusByName(name, tenantId);
    response = {
        status: true,
        data: createdStatus
    }

    return response
}
exports.getAllStatussWithPagination = async (page, size, tenantid) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(page, size);
    await status.findAndCountAll({ limit, offset, where: { tenant_id: tenantid } })
        .then(async (data) => {
            const res = await generalMethodService.getPagingData(data, page, limit);
            response = res;
        })
    return response;
}
exports.bugReportEmail = async (bugDescription, tenantId) => {
    let bugReportTemplate = emailTemplates.BUG_REPORT_EMAIL_TEMPLATE;
    bugReportTemplate = bugReportTemplate.replace('{tenantId}', tenantId);
    bugReportTemplate = bugReportTemplate.replace('{bugDescription}', bugDescription);

    await emailAPIService.sendEmail(coreSettingsConstants.SUPPORT_EMAIL, emailTemplates.BUG_REPORT_SUBJECT, null, null, null, bugReportTemplate);
}
exports.getDepartmentByName = async (departmentName, tenantId) => {

    return await department.findOne({ where: { [Op.and]: [{ name: departmentName }, { tenant_id: tenantId }] } });
}
exports.createDepartment = async (name, id, active, tenantId) => {
    let response = null;
    const obj = {
        name: name,
        tenant_id: tenantId,
        is_active: true
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id) !== null) {
        obj.id = id;
        obj.is_active = active;
        await department.update(obj, { where: { id: id } });
    } else {
        await department.create(obj);
    }

    const createdDepartment = await this.getDepartmentByName(name, tenantId);
    response = {
        status: true,
        data: createdDepartment
    }

    return response
}
exports.getDepartmentById = async (id, tenantId) => {
    return await department.findOne({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } });
}
exports.getAllDepartmentsWithPagination = async (page, size, tenantid) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(page, size);
    await department.findAndCountAll({ limit, offset, where: { tenant_id: tenantid } })
        .then(async (data) => {
            const res = await generalMethodService.getPagingData(data, page, limit);
            response = res;
        })
    return response;
}
exports.masterDropdownData = async (tenantId) => {
    let response = {};
    const departmentData = await department.findAll({ where: { tenant_id: tenantId } });
    response["departments"]= departmentData;
    return response;
}