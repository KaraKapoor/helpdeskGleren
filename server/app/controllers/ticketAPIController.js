const errorConstants = require("../constants/errorConstants");
const coreSettingsService = require("../Services/coreSettingAPIService");
const generalMethodService = require("../Services/generalMethodAPIService");
const tenantAPIService = require("../Services/tenantAPIService");
const userAPIService = require("../Services/userAPIService");
const fixversionAPIService = require("../Services/fixversionAPIService");
const ticketAPIService = require("../Services/ticketAPIService");
const { project, user, status, ticket } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;
const emailAPIService = require("../Services/emailAPIService");
const emailTemplates = require("../emailTemplates/emailTemplate");
const moment = require("moment");
const { VIEW_TICKET } = require("../constants/constants")

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
        const resp = await ticketAPIService.createTicket(input.departmentId, input.projectId, input.assigneeId, input.category, input.statusId, input.priority, input.fixVersion, input.issueDetails, input.issueSummary, input.dueDate, input.storyPoints, userDetails.id, tenantId, input.files , input.linked_tickets);
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
    const searchParam = await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.searchParam);
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
        conditionArray.push({ fix_version_id:{ [Op.in]: generalMethodService.csvToArray(  input.fixVersion )}});
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.dueDate) !== null) {
        conditionArray.push({ due_dt: input.dueDate });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.overdue) !== null) {
        conditionArray.push({ is_overdue: input.overdue === 'true' ? 1 : 0 });
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
        const resp = await ticketAPIService.getMyTickets(conditionArray, userDetails.id, tenantId, limit, offset, input.page, searchParam);
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
    const searchParam = await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.searchParam);
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
        conditionArray.push({ fix_version_id: { [Op.in]: generalMethodService.csvToArray(input.fixVersion ) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.dueDate) !== null) {
        conditionArray.push({ due_dt: input.dueDate });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.overdue) !== null) {
        conditionArray.push({ is_overdue: input.overdue === 'true' ? 1 : 0 });
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
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.reportedBy) !== null) {
        conditionArray.push({ created_by: { [Op.in]: generalMethodService.csvToArray(input.reportedBy) } });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.linkTicket) !== null) {
        
        conditionArray.push({ [Op.or]: [{ issue_details: { [Op.like]:`%${input.linkTicket}%`} }, { id: { [Op.like]:`%${input.linkTicket}%`} }] });
    }
    conditionArray.push({ tenant_id: tenantId });
    try {
        const resp = await ticketAPIService.getAllTickets(conditionArray, tenantId, limit, offset, input.page, searchParam);
        return res.status(200).send(resp);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getDashboardData = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;

    try {
        const resp = await ticketAPIService.getDashboardData(userDetails.id, tenantId);
        return res.status(200).send({ status: true, data: resp });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getTicketById = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const parentData=await ticket.findAll({where:{linked_tickets:[parseInt(input.id)]}})
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        return res.status(200).send({
            error: errorConstants.ID_ERROR,
            status: false
        });
    }

    try {
        const resp = await ticketAPIService.getTicketById(userDetails.id, tenantId, input.id);
        return res.status(200).send({ status: true, data: resp , parentlinkticket:parentData });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.updateTicket = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let updateObj = {};
    let type = null;
    let changedValue = null;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.field) == null) {

        return res.status(200).send({
            error: errorConstants.FIELD_ERROR,
            status: false
        });
    } else if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        return res.status(200).send({
            error: errorConstants.ID_ERROR,
            status: false
        });
    }
    switch (input.field) {

        case 'issueDetails':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.issueDetails) == null) {

                return res.status(200).send({
                    error: errorConstants.ISSUE_DETAILS_ERROR,
                    status: false
                });
            }
            type = 'issueDetails';
            changedValue = input.issueDetails;
            updateObj.issue_details = input.issueDetails;
            break;
        case 'issueSummary':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.issueSummary) == null) {

                return res.status(200).send({
                    error: errorConstants.ISSUE_DESCRIPTION_ERROR,
                    status: false
                });
            }
            type = 'issueSummary';
            changedValue = input.issueSummary;
            updateObj.issue_summary = input.issueSummary;
            break;
        case 'files':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.files) == null) {

                return res.status(200).send({
                    error: errorConstants.FILES_ERROR,
                    status: false
                });
            }
            type = 'files';
            changedValue = input.files;
            break;
        case 'assignee':
            const assignee = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: input.assignee }] } });
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.assignee) == null) {

                return res.status(200).send({
                    error: errorConstants.ASSIGNEE_NAME_ERROR,
                    status: false
                });
            }
            else if(assignee.id === input.assignee || !assignee.is_active){
                return res.status(200).send({
                    error: errorConstants.ASSIGNEE_INACTIVE,
                    status: false
                });
              }
            type = 'assignee';
            updateObj.assignee_id = input.assignee;
            changedValue = assignee.first_name + ' ' + assignee.last_name;
            break;
        case 'category':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.category) == null) {

                return res.status(200).send({
                    error: errorConstants.CATEGORY_ERROR,
                    status: false
                });
            }
            type = 'category';
            updateObj.category = input.category;
            changedValue = input.category;
            break;
        case 'status':
            const statusDetails = await status.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: input.status }] } });
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.status) == null) {

                return res.status(200).send({
                    error: errorConstants.STATUS_NAME_ERROR,
                    status: false
                });
            }
            else if(statusDetails.id === input.status || !statusDetails.is_active){
                return res.status(200).send({
                    error: errorConstants.STATUS_NAME_INACTIVE,
                    status: false
                });
            }
            type = 'status';
            updateObj.status_id = input.status;
            changedValue = statusDetails.name;
            break;
        case 'priority':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.priority) == null) {

                return res.status(200).send({
                    error: errorConstants.PRIORITY_ERROR,
                    status: false
                });
            }
            type = 'priority';
            updateObj.priority = input.priority;
            changedValue = input.priority;
            break;
        case 'fixVersion':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.fixVersion) == null) {

                return res.status(200).send({
                    error: errorConstants.FIX_VERSION_ERROR,
                    status: false
                });
            }
            const fix_version_name =  await db?.fix_version?.findOne({where:  [{ id: input?.fixVersion }]  }); 
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(fix_version_name) == null) {
                return res.status(200).send({
                    error: errorConstants.FIX_VERSION__ID_ERROR,
                    status: false
                });
            }
            else if(fix_version_name.id === input?.fixVersion || !fix_version_name.is_active){
                return res.status(200).send({
                    error: errorConstants.FIX_VERSION_INACTIVE,
                    status: false
                });
            }
            type = 'fixVersion';
            updateObj.fix_version_id = input.fixVersion;
            changedValue = fix_version_name.fix_version;
            break;
        case 'dueDate':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.dueDate) == null) {

                return res.status(200).send({
                    error: errorConstants.DUE_DATE_ERROR,
                    status: false
                });
            }
            type = 'dueDate';
            updateObj.due_dt = await generalMethodService.convertDateToUTC(input.dueDate);
            changedValue = input.dueDateInput;
            break;
        case 'storyPoints':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.storyPoints) == null) {

                return res.status(200).send({
                    error: errorConstants.STORY_POINT_ERROR,
                    status: false
                });
            }
            type = 'storyPoints';
            updateObj.story_points = input.storyPoints;
            changedValue = input.storyPoints;
            break;
        case 'resolvedBy':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.resolvedBy) == null) {

                return res.status(200).send({
                    error: errorConstants.RESOLVED_BY_ERROR,
                    status: false
                });
            }
            type = 'resolvedBy';
            const resolvedBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: input.resolvedBy }] } });
            updateObj.resolved_by = input.resolvedBy;
            changedValue = resolvedBy.first_name + ' ' + resolvedBy.last_name;
            break;
        case 'reviewedBy':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.reviewedBy) == null) {

                return res.status(200).send({
                    error: errorConstants.REVIEWED_BY_ERROR,
                    status: false
                });
            }
            type = 'reviewedBy';
            const reviewedBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: input.reviewedBy }] } });
            updateObj.reviewed_by = input.reviewedBy;
            changedValue = reviewedBy.first_name + ' ' + reviewedBy.last_name;
            break;
        case 'testedBy':
            if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.testedBy) == null) {

                return res.status(200).send({
                    error: errorConstants.TESTED_BY_ERROR,
                    status: false
                });
            }
            type = 'testedBy';
            const testedBy = await user.findOne({ where: { [Op.and]: [{ tenant_id: tenantId }, { id: input.testedBy }] } });
            updateObj.tested_by = input.testedBy;
            changedValue = testedBy.first_name + ' ' + testedBy.last_name;
            break;
        case 'linked_tickets':
            type = 'linked_tickets';
            updateObj.linked_tickets = input.linktickets;
            changedValue = input.linktickets;
            break;
    }

    try {
        const resp = await ticketAPIService.updateTicket(type, userDetails, tenantId, updateObj, input.id, changedValue);
        return res.status(200).send(resp);
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getTicketHistory = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {

        return res.status(200).send({
            error: errorConstants.ID_ERROR,
            status: false
        });
    }
    try {
        const resp = await ticketAPIService.getTicketHistory(userDetails, tenantId, input.id);
        return res.status(200).send({ status: true, data: resp });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.saveTicketComments = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;

    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.ticketId) == null) {

        return res.status(200).send({
            error: errorConstants.TICKET_ID_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.htmlComments) == null) {

        return res.status(200).send({
            error: errorConstants.HTML_COMMENT_MANDATORY,
            status: false
        });
    }

    try {
        const resp = await ticketAPIService.saveComments(userDetails, tenantId, input.ticketId, input.htmlComments,input.emailIds);
        if(await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.emailIds) !== null){
            const emailIds = input.emailIds;
            emailIds.map(async id=>{
                let mentionedInTicketTemplate = emailTemplates.MENTIONED_IN_TICKET_TEMPLATE;
              //  mentionedInTicketTemplate = mentionedInTicketTemplate.replace('{username}', userDetails.first_name);
                mentionedInTicketTemplate = mentionedInTicketTemplate.replace(/{ticketNumber}/g, input.ticketId);
                mentionedInTicketTemplate = mentionedInTicketTemplate.replace('{url}', process.env.BASE_URL);
                mentionedInTicketTemplate = mentionedInTicketTemplate.replace('{view_ticket}', VIEW_TICKET);
                mentionedInTicketTemplate = mentionedInTicketTemplate.replace('{html_comments}', input.htmlComments);

                await emailAPIService.sendEmail(id, emailTemplates.MENTIONED_IN_TICKET_SUBJECT, null, null, null, mentionedInTicketTemplate);
            })
        }
        return res.status(200).send({ status: true, data: resp });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getTicketComments = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;

    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.ticketId) == null) {

        return res.status(200).send({
            error: errorConstants.TICKET_ID_ERROR,
            status: false
        });
    }

    try {
        const resp = await ticketAPIService.getTicketComments(userDetails, tenantId, input.ticketId);
        return res.status(200).send({ status: true, data: resp });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }

}
