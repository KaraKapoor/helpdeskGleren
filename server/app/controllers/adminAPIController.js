const errorConstants = require("../constants/errorConstants");
const coreSettingsService = require("../Services/coreSettingAPIService");
const generalMethodService = require("../Services/generalMethodAPIService");
const tenantAPIService = require("../Services/tenantAPIService");
const userAPIService = require("../Services/userAPIService");
const adminAPIService = require("../Services/adminAPIService");
const { project } = require("../models");
const fileAPIService = require("../Services/fileAPIService");

exports.createProject = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let isNew = false;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.projectName) == null) {

        return res.status(200).send({
            error: errorConstants.PROJECT_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        isNew = true;
    }
    try {
        const response = await adminAPIService.getProjectByName(input.projectName, tenantId);
        if (isNew && response?.name) {
            return res.status(200).send({
                error: errorConstants.PROJECT_NAME_SAME_ERROR,
                status: false
            });
        } else if (!isNew && input?.projectName === response?.name && response.id != input.id) {
            return res.status(200).send({
                error: errorConstants.PROJECT_NAME_SAME_ERROR,
                status: false
            });
        } else {
            const resp = await adminAPIService.createProject(input.projectName, input.id, input.is_active, tenantId);
            return res.status(200).send(resp);
        }



    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getProjectById = async (req, res) => {
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
        const response = await adminAPIService.getProjectById(input.id, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getAllProjects = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
    const { page, size } = req.query;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }
    try {
        const response = await adminAPIService.getAllProjectsWithPagination(page, size, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.createStatus = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let isNew = false;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.statusName) == null) {

        return res.status(200).send({
            error: errorConstants.STATUS_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.departmentId) == null) {

        return res.status(200).send({
            error: errorConstants.DEPARTMENT_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        isNew = true;
    }
    try {
        const response = await adminAPIService.getStatusByName(input.statusName, tenantId);
        if (isNew && response?.name) {
            return res.status(200).send({
                error: errorConstants.STATUS_NAME_SAME_ERROR,
                status: false
            });
        } else if (!isNew && input?.statusName === response?.name && response.id != input.id) {
            return res.status(200).send({
                error: errorConstants.STATUS_NAME_SAME_ERROR,
                status: false
            });
        } else {
            const resp = await adminAPIService.createStatus(input.statusName, input.id, input.is_active, tenantId, input.statusType, input.departmentId);
            return res.status(200).send(resp);
        }



    } catch (exception) {
        console.log("Exception is \n" + exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getStatusById = async (req, res) => {
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
        const response = await adminAPIService.getStatusById(input.id, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getStatusByDepartmentId = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const departmentId = input.departmentId;

    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.departmentId) == null) {

        return res.status(200).send({
            error: errorConstants.ID_ERROR,
            status: false
        });
    }

    try {
        const response = await adminAPIService.getStatusByDepartmentId(departmentId, tenantId);
        return res.status(200).send({ status: true, data: response });
    }
    catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getAllStatus = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
    const { page, size } = req.query;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }
    try {
        const response = await adminAPIService.getAllStatussWithPagination(page, size, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.createHolidays = async (req, res) => {
    console.log("creating holidaY");
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let isNew = false;
    if (
      (await generalMethodService.do_Null_Undefined_EmptyArray_Check(
        input.holidayName
      )) == null
    ) {
      return res.status(200).send({
        error: errorConstants.HOLIDAY_NAME_ERROR,
        status: false,
      });
    }
    if (
      (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id)) ==
      null
    ) {
      isNew = true;
    }
    try {
      const response = await adminAPIService.getHolidaysByName(
        input.holidayName,
        tenantId
      );
      if (isNew && response?.holiday_name) {
        return res.status(200).send({
          error: errorConstants.HOLIDAY_SAME_NAME_ERROR,
          status: false,
        });
      } else if (
        !isNew &&
        input?.holidayName === response?.holiday_name &&
        response.id != input.id
      ) {
        return res.status(200).send({
          error: errorConstants.HOLIDAY_SAME_NAME_ERROR,
          status: false,
        });
      } else {
        const resp = await adminAPIService.createHolidays(
          input.holidayName,
          input.holidayDate,
          tenantId
        );
        return res.status(200).send(resp);
      }
    } catch (exception) {
      console.log(exception);
      return res.status(200).send({
        error: errorConstants.SOME_ERROR_OCCURRED,
        status: false,
      });
    }
  };
  exports.getHolidaysById = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    if (
      (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id)) ==
      null
    ) {
      return res.status(200).send({
        error: errorConstants.ID_ERROR,
        status: false,
      });
    }
  
    try {
      const response = await adminAPIService.getHolidaysById(input.id, tenantId);
      return res.status(200).send({ status: true, data: response });
    } catch (exception) {
      console.log(exception);
      return res.status(200).send({
        error: errorConstants.SOME_ERROR_OCCURRED,
        status: false,
      });
    }
  };
  
  exports.getHolidaysByName = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    if (
      (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id)) ==
      null
    ) {
      return res.status(200).send({
        error: errorConstants.ID_ERROR,
        status: false,
      });
    }
  
    try {
      const response = await adminAPIService.getHolidaysByName(
        input.holidayName,
        tenantId
      );
      return res.status(200).send({ status: true, data: response });
    } catch (exception) {
      console.log(exception);
      return res.status(200).send({
        error: errorConstants.SOME_ERROR_OCCURRED,
        status: false,
      });
    }
  };
  
  exports.getAllHolidays = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
    const { page, size } = req.query;
    if (
      (await generalMethodService.do_Null_Undefined_EmptyArray_Check(
        input.page
      )) == null
    ) {
      return res.status(200).send({
        error: errorConstants.PAGE_NO_ERROR,
        status: false,
      });
    }
    if (
      (await generalMethodService.do_Null_Undefined_EmptyArray_Check(
        input.size
      )) == null
    ) {
      return res.status(200).send({
        error: errorConstants.PAGE_SIZE_ERROR,
        status: false,
      });
    }
    try {
      const response = await adminAPIService.getAllHolidaysWithPagination(
        page,
        size,
        tenantId
      );
      return res.status(200).send({ status: true, data: response });
    } catch (exception) {
      console.log(exception);
      return res.status(200).send({
        error: errorConstants.SOME_ERROR_OCCURRED,
        status: false,
      });
    }
  };
exports.bugReportEmail = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.issueDescription) == null) {

        return res.status(200).send({
            error: errorConstants.ISSUE_DESCRIPTION_ERROR,
            status: false
        });
    }

    try {
        const response = await adminAPIService.bugReportEmail(input.issueDescription,input.attachment, tenantId,userDetails);
        return res.status(200).send({
            status: true
        })

    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.createDepartment = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let isNew = false;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.departmentName) == null) {

        return res.status(200).send({
            error: errorConstants.DEPARTMENT_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        isNew = true;
    }
    try {
        const response = await adminAPIService.getDepartmentByName(input.departmentName, tenantId);
        if (isNew && response?.name) {
            return res.status(200).send({
                error: errorConstants.DEPARTMENT_NAME_SAME_ERROR,
                status: false
            });
        } else if (!isNew && input?.departmentName === response?.name && response.id != input.id) {
            return res.status(200).send({
                error: errorConstants.DEPARTMENT_NAME_SAME_ERROR,
                status: false
            });
        } else {
            const resp = await adminAPIService.createDepartment(input.departmentName, input.id, input.is_active, tenantId);
            return res.status(200).send(resp);
        }



    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getDepartmentById = async (req, res) => {
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
        const response = await adminAPIService.getDepartmentById(input.id, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getAllDepartments = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
    const { page, size } = req.query;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }
    try {
        const response = await adminAPIService.getAllDepartmentsWithPagination(page, size, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.masterDropDownData = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;

    try {
        const response = await adminAPIService.masterDropdownData(tenantId, req.user.user_id);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }

}
exports.createEscalationMatrix = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let isNew = false;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.departmentId) == null) {

        return res.status(200).send({
            error: errorConstants.DEPARTMENT_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        isNew = true;
    }
    try {
        const response = await adminAPIService.getEscalationByDepartmentId(input.departmentId, tenantId);
        if (isNew && response?.department_id) {
            return res.status(200).send({
                error: errorConstants.SAME_ESCALATION_ERROR,
                status: false
            });
        } else if (!isNew && input?.departmentId === response?.department_id && response.id != input.id) {
            return res.status(200).send({
                error: errorConstants.SAME_ESCALATION_ERROR,
                status: false
            });
        }
        else {
            const resp = await adminAPIService.createEscalations(input.departmentId, input.l1Id, input.l2Id, input.l3Id, input.l4Id, input.l5Id, input.l6Id, input.id, input.is_active, tenantId);
            return res.status(200).send(resp);
        }



    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getEscalationById = async (req, res) => {
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
        const response = await adminAPIService.getEscalationById(input.id, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getAllEscalations = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
    const { page, size } = req.query;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }
    try {
        const response = await adminAPIService.getAllEscalationsWithPagination(page, size, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getAllTeams = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
    const { page, size } = req.query;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.page) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_NO_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.size) == null) {

        return res.status(200).send({
            error: errorConstants.PAGE_SIZE_ERROR,
            status: false
        });
    }
    try {
        const response = await adminAPIService.getAllTeamsWithPagination(page, size, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.createTeam = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let isNew = false;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.teamName) == null) {

        return res.status(200).send({
            error: errorConstants.TEAM_NAME_ERROR,
            status: false
        });
    }
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
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.leads) == null) {

        return res.status(200).send({
            error: errorConstants.LEADS_EMPTY_ARRAY_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.agents) == null) {

        return res.status(200).send({
            error: errorConstants.AGENT_EMPTY_ARRAY_ERROR,
            status: false
        });
    }

    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        isNew = true;
    }
    try {
        const response = await adminAPIService.getTeamByName(input.teamName, tenantId);
        if (isNew && response?.name) {
            return res.status(200).send({
                error: errorConstants.TEAM_NAME_SAME_ERROR,
                status: false
            });
        } else if (!isNew && input?.teamName === response?.name && response.id != input.id) {
            return res.status(200).send({
                error: errorConstants.TEAM_NAME_SAME_ERROR,
                status: false
            });
        } else {
            const resp = await adminAPIService.createTeam(input.id, input.teamName, input.active, input.departmentId, input.projectId, input.users, input.leads, input.agents, tenantId, userDetails.id);
            return res.status(200).send(resp);
        }



    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getTeamById = async (req, res) => {
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
        const response = await adminAPIService.getTeamById(input.id, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}