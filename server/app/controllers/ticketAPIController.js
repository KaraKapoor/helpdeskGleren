const errorConstants = require("../constants/errorConstants");
const coreSettingsService = require("../Services/coreSettingAPIService");
const generalMethodService = require("../Services/generalMethodAPIService");
const tenantAPIService = require("../Services/tenantAPIService");
const userAPIService = require("../Services/userAPIService");
const adminAPIService = require("../Services/adminAPIService");
const ticketAPIService = require("../Services/ticketAPIService");
const { project } = require("../models");

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
        const resp = await ticketAPIService.createTicket(input.departmentId, input.projectId, input.assigneeId, input.category, input.statusId, input.priority, input.fixVersion, input.issueDetails, input.issueSummary, input.dueDate, input.storyPoints, userDetails.id, tenantId,input.files);
        return res.status(200).send(resp);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}