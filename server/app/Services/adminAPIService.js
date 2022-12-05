
const db = require("../models");
const project = db.project;
const status = db.status;
const user = db.user;
const department = db.department;
const escalations = db.escalations;
const Op = db.Sequelize.Op;
const generalMethodService = require("../Services/generalMethodAPIService");
const emailTemplates = require("../emailTemplates/emailTemplate");
const emailAPIService = require("./emailAPIService");
const userAPIService = require("./userAPIService");
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
    response["departments"] = departmentData;
    const usersData = await user.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }, { role: { [Op.in]: ['admin', 'agent', 'teamLead'] } }] } });
    response["agents"] = usersData;
    return response;
}
exports.getEscalationByDepartmentId = async (departmentId, tenantId) => {

    return await escalations.findOne({ where: { [Op.and]: [{ department_id: departmentId }, { tenant_id: tenantId }] } });
}
exports.createEscalations = async (departmentId, l1Id, l2Id, l3Id, l4Id, l5Id, l6Id, id, active, tenantId) => {
    let response = null;
    const obj = {
        l1_id: l1Id,
        l2_id: l2Id,
        l3_id: l3Id,
        l4_id: l4Id,
        l5_id: l5Id,
        l6_id: l6Id,
        tenant_id: tenantId,
        is_active: true,
        department_id: departmentId
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id) !== null) {
        obj.id = id;
        obj.is_active = active;
        await escalations.update(obj, { where: { id: id } });
    } else {
        await escalations.create(obj);
    }

    const createdEscalations = await this.getEscalationByDepartmentId(departmentId, tenantId);
    response = {
        status: true,
        data: createdEscalations
    }

    return response
}
exports.getEscalationById = async (id, tenantId) => {
    let response = null;
    const data = await escalations.findOne({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } });
    if (data !== null) {
        response = data.dataValues;
        if (data.l1_id != null) {
            response.l1User = await userAPIService.getUserById(data.l1_id);
        }
        if (data.l2_id != null) {
            response.l2User = await userAPIService.getUserById(data.l2_id);
        }
        if (data.l3_id != null) {
            response.l3User = await userAPIService.getUserById(data.l3_id);
        }
        if (data.l4_id != null) {
            response.l4User = await userAPIService.getUserById(data.l4_id);
        }
        if (data.l5_id != null) {
            response.l5User = await userAPIService.getUserById(data.l5_id);
        }
        if (data.l6_id != null) {
            response.l6User = await userAPIService.getUserById(data.l6_id);
        }
    }
    return response;
}
exports.getAllEscalationsWithPagination = async (page, size, tenantid) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(page, size);
    await escalations.findAndCountAll({ limit, offset, where: { tenant_id: tenantid }, include: [{ model: db.department }] })
        .then(async (data) => {
            const res = await generalMethodService.getPagingData(data, page, limit);
            response = res;
        })
    return response;
}