const errorConstants = require("../constants/errorConstants");
const coreSettingsService = require("../Services/coreSettingAPIService");
const generalMethodService = require("../Services/generalMethodAPIService");
const tenantAPIService = require("../Services/tenantAPIService");
const userAPIService = require("../Services/userAPIService");
const adminAPIService = require("../Services/adminAPIService");
const ticketAPIService = require("../Services/ticketAPIService");
const { project } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

exports.createTicket = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.departmentId) == null) {

        return res.status(200).send({
            error: errorConstants.DEPARTMENT_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.projectId) == null) {

        return res.status(200).send({
            error: errorConstants.PROJECT_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.assigneeId) == null) {

        return res.status(200).send({
            error: errorConstants.ASSIGNEE_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.category) == null) {

        return res.status(200).send({
            error: errorConstants.CATEGORY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.statusId) == null) {

        return res.status(200).send({
            error: errorConstants.STATUS_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.priority) == null) {

        return res.status(200).send({
            error: errorConstants.PRIORITY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.issueDetails) == null) {

        return res.status(200).send({
            error: errorConstants.ISSUE_DETAILS_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.issueSummary) == null) {

        return res.status(200).send({
            error: errorConstants.ISSUE_SUMMARY_ERROR,
            status: false
        });
    }
    try {
        const resp = await ticketAPIService.createTicket(input.departmentId, input.projectId, input.assigneeId, input.category, input.statusId, input.priority, input.fixVersion, input.issueDetails, input.issueSummary, input.dueDate, input.storyPoints, userDetails.id, tenantId, input.files);
        return res.status(200).send(resp);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getMyTickets = async (req, res) => {
    const input = req.query;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const searchParam= await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.searchParam);
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {
        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    } else if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {
        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }


    const { limit, offset } = await generalMethodService.getPagination(input.page, input.size);
    let conditionArray = [];

    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.startDate) !== null && await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.endDate) !== null) {
        conditionArray.push({ createdAt: { [Op.between]: [`${input.startDate}`, `${input.endDate}`] } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.projectId) !== null) {
        conditionArray.push({ project_id: { [Op.in]: generalMethodService.csvToArray(input.projectId) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.assigneeId) !== null) {
        conditionArray.push({ assignee_id: { [Op.in]: generalMethodService.csvToArray(input.assigneeId) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.statusId) !== null) {
        conditionArray.push({ status_id: { [Op.in]: generalMethodService.csvToArray(input.statusId) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.fixVersion) !== null) {
        conditionArray.push({ fix_version: input.fixVersion });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.dueDate) !== null) {
        conditionArray.push({ due_dt: input.dueDate });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.overdue) !== null) {
        conditionArray.push({ is_overdue: input.overdue==='true'?true:false });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.reviewedBy) !== null) {
        conditionArray.push({ reviewed_by: { [Op.in]: generalMethodService.csvToArray(input.reviewedBy) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.resolvedBy) !== null) {
        conditionArray.push({ resolved_by: { [Op.in]: generalMethodService.csvToArray(input.resolvedBy) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.testedBy) !== null) {
        conditionArray.push({ tested_by: { [Op.in]: generalMethodService.csvToArray(input.testedBy) } });
    }
    conditionArray.push({ tenant_id: tenantId });
    conditionArray.push({ created_by: userDetails.id });
    try {
        const resp = await ticketAPIService.getMyTickets(conditionArray, userDetails.id, tenantId, limit, offset, input.page,searchParam);
        return res.status(200).send(resp);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getAllTickets = async (req, res) => {
    const input = req.query;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const searchParam= await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.searchParam);
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {
        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    } else if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {
        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }


    const { limit, offset } = await generalMethodService.getPagination(input.page, input.size);
    let conditionArray = [];

    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.startDate) !== null && await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.endDate) !== null) {
        conditionArray.push({ createdAt: { [Op.between]: [`${input.startDate}`, `${input.endDate}`] } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.projectId) !== null) {
        conditionArray.push({ project_id: { [Op.in]: generalMethodService.csvToArray(input.projectId) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.assigneeId) !== null) {
        conditionArray.push({ assignee_id: { [Op.in]: generalMethodService.csvToArray(input.assigneeId) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.statusId) !== null) {
        conditionArray.push({ status_id: { [Op.in]: generalMethodService.csvToArray(input.statusId) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.fixVersion) !== null) {
        conditionArray.push({ fix_version: input.fixVersion });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.dueDate) !== null) {
        conditionArray.push({ due_dt: input.dueDate });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.overdue) !== null) {
        conditionArray.push({ is_overdue: input.overdue==='true'?true:false });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.reviewedBy) !== null) {
        conditionArray.push({ reviewed_by: { [Op.in]: generalMethodService.csvToArray(input.reviewedBy) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.resolvedBy) !== null) {
        conditionArray.push({ resolved_by: { [Op.in]: generalMethodService.csvToArray(input.resolvedBy) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.testedBy) !== null) {
        conditionArray.push({ tested_by: { [Op.in]: generalMethodService.csvToArray(input.testedBy) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.createdBy) !== null) {
        conditionArray.push({ created_by: { [Op.in]: generalMethodService.csvToArray(input.createdBy) } });
    }
    conditionArray.push({ tenant_id: tenantId });
    try {
        const resp = await ticketAPIService.getAllTickets(conditionArray, tenantId, limit, offset, input.page,searchParam);
        return res.status(200).send(resp);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}