
const db = require("../models");
const project = db.project;
const status = db.status;
const Op = db.Sequelize.Op;
exports.getProjectByName = async (projectName, tenantId) => {

    return await project.findOne({ where: { [Op.and]: [{ name: projectName }, { tenant_id: tenantId }] } });
}

exports.getProjectById = async (id, tenantId) => {
    return await project.findOne({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } });
}
exports.createProject = async (name, tenantId) => {
    let response = null;
    const obj = {
        name: name,
        tenant_id: tenantId,
        is_active: true
    }
    await project.create(obj);
    const createdProject = await this.getProjectByName(name, tenantId);
    response = {
        status: true,
        data: createdProject
    }

    return response
}   

exports.getStatusByName = async (statusName, tenantId) => {
    return await status.findOne({ where: { [Op.and]: [{ name: statusName }, { tenant_id: tenantId }] } });
}
exports.getStatusById = async (id, tenantId) => {
    return await status.findOne({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } });
}
exports.createStatus = async (name, tenantId) => {
    let response = null;
    const obj = {
        name: name,
        tenant_id: tenantId,
        is_active: true
    }
    await status.create(obj);
    const createdStatus = await this.getStatusByName(name, tenantId);
    response = {
        status: true,
        data: createdStatus
    }

    return response
}   