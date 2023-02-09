const errorConstants = require("../constants/errorConstants");
const coreSettingsService = require("../Services/coreSettingAPIService");
const generalMethodService = require("../Services/generalMethodAPIService");
const tenantAPIService = require("../Services/tenantAPIService");
const userAPIService = require("../Services/userAPIService");
const adminAPIService = require("../Services/adminAPIService");
const fixversionAPIService = require("../Services/fixversionAPIService");
const db = require("../models");
const e = require("express");


exports.createTenantSettings = async (req, res) =>{
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    
    try {
        const resp = await adminAPIService.createTenantSettings(input.settingName, input.setting_value, tenantId);
        return res.status(200).send(resp);
    } catch (exception) {
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.getTenantSettingsById = async (req, res) => {
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
        const response = await adminAPIService.getTenantSettingsById(input.id, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getAllTenantSettings = async (req, res) => {
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const input = req.query;
   
    try {
        const response = await adminAPIService.getAllTenantSetting( tenantId );
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        return res.status(400).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
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
        const responseDepartment = await adminAPIService.getDepartmentById(input.departmentId,tenantId)
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
        } else if(responseDepartment.id === input.id || !responseDepartment.is_active){
            return res.status(200).send({
                error: errorConstants.DEPARTMENT_NAME_INACTIVE,
                status: false
            });
        }  
        else {
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
        let result;
        if (response) {
            result = { status: true, data: response }
        } else {
            result = { status: false, message : "Status with this ID does not exist or Invalid ID" }
        }
        return res.status(200).send(result);
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


exports.createHoliday = async (req, res) => {
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    let update = false;
   
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        update = true;
    }  
    try {
        const response = await adminAPIService.getHolidaysByDate(
            input.holidayDate,
            tenantId,
            input.projectId
        );
        if (input.id) {
            let dbDate ;
            if(response != null)
            dbDate = response.holiday_date;
            console.log(input.holidayDate);
            console.log(response);
            if (response && dbDate === input.holidayDate && response.project_id == input.projectId && response.is_active === true && input.id != response.id) {
              return res.status(200).send({
                           error: errorConstants.HOLIDAY_ALREADY_EXIST,
                status: false,
              });
            
            } else  {
              const resp = await adminAPIService.createHoliday(
                input.holidayName,
                input.holidayDate,
                tenantId,
                input.projectId,
                input.id,
                input.is_active
              );
              return res.status(200).send(resp);
            }
          }
        //creating new HOLiday by comparing to database for holiday exists on that date or not and for that project
        else if (response != null) {
            console.log("New Holiday");
            console.log(response.holiday_date , input.holidayDate)
            console.log(response.is_active);
            if (response.project_id == input.projectId && response.is_active == true)  {
                  return res.status(200).send({
                    error: errorConstants.HOLIDAY_ALREADY_EXIST,
                    status: false,
                  });
            } else {
                 const resp = await adminAPIService.createHoliday(
                   input.holidayName,
                   input.holidayDate,
                   tenantId,
                   input.projectId,
                   input.id,
                   input.is_active
                 );
                 return res.status(200).send(resp);
             }
        } else {
            const resp = await adminAPIService.createHoliday(
              input.holidayName,
              input.holidayDate,
              tenantId,
              input.projectId,
              input.is_active
            );
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
    console.log(input);
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.departmentName) == null) {

        return res.status(200).send({
            error: errorConstants.DEPARTMENT_NAME_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        isNew = true;
    }
    console.log(input.id);
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
        const responseDepartment = await adminAPIService.getDepartmentById(input.departmentId,tenantId)
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
        else if(responseDepartment.id === input.id || !responseDepartment.is_active){
            return res.status(200).send({
                error: errorConstants.DEPARTMENT_NAME_INACTIVE,
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
        const responseProject = await adminAPIService.getProjectById(input.projectId,tenantId)
        const responseDepartment = await adminAPIService.getDepartmentById(input.departmentId,tenantId)
        if (isNew && response?.name) {
            return res.status(200).send({
                error: errorConstants.TEAM_NAME_SAME_ERROR,
                status: false
            });

        }else if(responseProject.id === input.id || !responseProject.is_active){
            return res.status(200).send({
                error: errorConstants.PROJECT_NAME_INACTIVE,
                status: false
            });
        } 
        else if(responseDepartment.id === input.id || !responseDepartment.is_active){
            return res.status(200).send({
                error: errorConstants.DEPARTMENT_NAME_INACTIVE,
                status: false
            });
        } 
        else if (!isNew && input?.teamName === response?.name && response.id != input.id) {
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
exports.createFixVersion = async (req, res) => {
    const input = req.body
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenant_id = userDetails.tenant_id;
    // const fix_data= await fixversionAPIService.getFixVersionByProjectSingle(input.project_id,tenant_id)
    // if (await fix_data !=null) {
    //     return res.status(200).send({
    //         error: errorConstants.PROJECT_ALREADY_ERROR,
    //         status: false
    //     });
    // }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.fixversion) == null) {

        return res.status(200).send({
            error: errorConstants.FIX_VERSION_ERROR,
            status: false
        });
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.project_id) == null) {

        return res.status(200).send({
            error: errorConstants.PROJECTID_ERROR_OCCURRED,
            status: false
        });
    }
    let isNew=false;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input.id) == null) {
        isNew = true;
    }
    try {
        const response = await fixversionAPIService.getFixVersionByName(input.fixversion, tenant_id);
        const responseProject = await adminAPIService.getProjectById(input.project_id,tenant_id)

        if (isNew && response?.fix_version) {
            return res.status(200).send({
                error: errorConstants.FIX_VERSION_SAME_ERROR,
                status: false
            });
        }else if(responseProject?.id === input?.projectId || !responseProject.is_active){
            return res.status(200).send({
                error: errorConstants.PROJECT_NAME_INACTIVE,
                status: false
            });
        }
         else if (!isNew && input?.fixversion === response?.fix_version && response.id != input.id) {
            return res.status(200).send({
                error: errorConstants.FIX_VERSION_SAME_ERROR,
                status: false
            });
        } else {
            const response = await fixversionAPIService.CreateFixVersion(input.fixversion, input.is_active, tenant_id, input.project_id, input.id);
            return res.status(200).send({ status: true, data: response });
        }
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.getAllversions = async(req,res)=>{
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const { page, size } = req.query;
    try {
        const response = await fixversionAPIService.getPaginationVersion(page, size, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}

exports.getVersionById = async(req, res)=>{
    const input = req.body;
    const userDetails = await userAPIService.getUserById(req.user.user_id);
    const tenantId = userDetails.tenant_id;
    const fixVersionId = await fixversionAPIService.getFixVersionById(input.id,tenantId);
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(fixVersionId) == null) {
        return res.status(200).send({
            error: errorConstants.FIX_VERSION__ID_ERROR,
            status: false
        });
    }
    try {
        const response = await fixversionAPIService.getFixVersionById(input.id, tenantId);
        return res.status(200).send({ status: true, data: response });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}
exports.getVersionByProject = async(req, res)=>{
    const input = req.body.project_id;
    // const userDetails = await userAPIService.getUserById(req.user.user_id);
    // const tenantId = userDetails.tenant_id;
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(input) == null) {
        return res.status(200).send({
            error: errorConstants.PROJECT_ID_ERROR,
            status: false
        });
    }
    try {
        const attachmentData =  await generalMethodService.executeRawSelectQuery(`select * from fix_versions where project_id in (${String(input)})`)
        // const response = await fixversionAPIService.getFixVersionByProject(input,tenantId);
        return res.status(200).send({ status: true, data: attachmentData });
    } catch (exception) {
        console.log(exception);
        return res.status(200).send({
            error: errorConstants.SOME_ERROR_OCCURRED,
            status: false
        });
    }
}