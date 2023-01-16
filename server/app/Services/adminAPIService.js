
const db = require("../models");
const project = db.project;
const status = db.status;
const user = db.user;
const holidays = db.holidays;
const department = db.department;
const team = db.team;
const teamAgentAssociation = db.teamAgentAssociation;
const escalations = db.escalations;
const Op = db.Sequelize.Op;
const generalMethodService = require("../Services/generalMethodAPIService");
const emailTemplates = require("../emailTemplates/emailTemplate");
const emailAPIService = require("./emailAPIService");
const userAPIService = require("./userAPIService");
const coreSettingsConstants = require("../constants/coreSettingsConstants");
const { htmlToText } = require('html-to-text');
const queries = require("../constants/queries");

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
exports.getStatusByDepartmentId = async (departmentId, tenantId) => {
    return await status.findAll({ where: { [Op.and]: [{ department_id: departmentId }, { tenant_id: tenantId }] } });
}
exports.createStatus = async (name, id, active, tenantId, statusType, departmentId) => {
    let response = null;
    const obj = {
        name: name,
        department_id: departmentId,
        tenant_id: tenantId,
        status_type: statusType,
        is_active: true,
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
};

exports.getHolidaysByName = async (holidayName, tenantId) => {
    return await holidays.findOne({
      where: {
        [Op.and]: [{ holiday_name: holidayName }, { tenant_id: tenantId }],
      },
    });
  };
  exports.getHolidaysById = async (id, tenantId) => {
    return await holidays.findOne({
      where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] },
    });
  };
  exports.createHolidays = async (holidayName, holidayDate, tenantId, id) => {
    let response = null;
    const obj = {
      holiday_name: holidayName,
      holiday_date: holidayDate,
      tenant_id: tenantId,
    };
    if (
      (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id)) !== null
    ) {
      obj.id = id;
      await holidays.update(obj, { where: { id: id } });
    } else {
      await holidays.create(obj);
    }
  
    const createdHoliday = await this.getHolidaysByName(holidayName, tenantId);
    response = {
      status: true,
      data: createdHoliday,
    };
  
    return response;
  };
  exports.getAllHolidaysWithPagination = async (page, size, tenantId) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(
      page,
      size
    );
    await holidays
      .findAndCountAll({ limit, offset, where: { tenant_id: tenantId } })
      .then(async (data) => {
        const res = await generalMethodService.getPagingData(data, page, limit);
        response = res;
      });
    return response;
  };
exports.bugReportEmail = async (bugDescription,attachmentId, tenantId,userDetails) => {
    let bugReportTemplate = emailTemplates.BUG_REPORT_EMAIL_TEMPLATE;
    bugReportTemplate = bugReportTemplate.replace('{tenantId}', tenantId);
    bugReportTemplate = bugReportTemplate.replace('{bugDescription}', bugDescription);
    await emailAPIService.sendEmail(coreSettingsConstants.SUPPORT_EMAIL, emailTemplates.BUG_REPORT_SUBJECT, null, null, null, bugReportTemplate,attachmentId,userDetails,tenantId);
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
exports.masterDropdownData = async (tenantId, currentUserId) => {
    let response = {};
    const departmentData = await department.findAll({ where: { tenant_id: tenantId } });
    response["departments"] = departmentData;
    const usersData = await user.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }, { role: { [Op.in]: ['admin', 'agent', 'teamLead'] } }] } });
    response["agents"] = usersData;
    const projectsData = await project.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }] } });
    response["projects"] = projectsData;

    let currenUserProjectsQuery = queries.GET_LOGGED_IN_USER_PROJECTS;
    currenUserProjectsQuery = currenUserProjectsQuery.replace(/:id/g, currentUserId);
    currenUserProjectsQuery = currenUserProjectsQuery.replace(/:tenantId/g, tenantId)
    const currenUserProjects = await this.executeRawSelectQuery(currenUserProjectsQuery);
    response["currentUserProjects"] = currenUserProjects;

    let currentUserDepartmentsQuery = queries.GET_LOGGED_IN_USER_DEPARTMENTS;
    currentUserDepartmentsQuery = currentUserDepartmentsQuery.replace(/:id/g, currentUserId);
    currentUserDepartmentsQuery = currentUserDepartmentsQuery.replace(/:tenantId/g, tenantId);
    const currenUserDepartments = await this.executeRawSelectQuery(currentUserDepartmentsQuery);
    response["currentUserDepartments"] = currenUserDepartments;


    const onlyUsersData = await user.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }, { role: { [Op.notIn]: ['admin', 'agent', 'teamLead'] } }] } });
    response["users"] = onlyUsersData;
    const statusType = ["ToDo", "InProgress", "Close"];
    response["statusTypes"] = statusType;
    const roles = ["admin", "agent", "teamLead", "user"];
    response["roles"] = roles;
    const ticketPriorites = ["Minor", "Major", "Critical", "Blocker"];
    response["ticketPriorites"] = ticketPriorites;
    const ticketCategory = ["Bug", "Improvement", "Task", "New Feature"];
    response["ticketCategory"] = ticketCategory;

    const activeStatus = await status.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }, { is_active: true }] } });
    response["activeStatus"] = activeStatus;
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
exports.getAllTeamsWithPagination = async (page, size, tenantid) => {
    let response = null;
    const { limit, offset } = await generalMethodService.getPagination(page, size);
    await team.findAndCountAll({ limit, offset, where: { tenant_id: tenantid } })
        .then(async (data) => {
            const res = await generalMethodService.getPagingData(data, page, limit);
            response = res;
        })
    return response;
}
exports.getTeamByName = async (teamName, tenantId) => {

    return await team.findOne({ where: { [Op.and]: [{ name: teamName }, { tenant_id: tenantId }] } });
}
exports.createTeam = async (id, teamName, active, departmentId, projectId, users, leads, agents, tenantId, loggedInUserId) => {
    let response = null;
    const obj = {
        name: teamName,
        tenant_id: tenantId,
        is_active: true,
        updated_by: loggedInUserId
    }
    if (await generalMethodService.do_Null_Undefined_EmptyArray_Check(id) !== null) {
        obj.id = id;
        obj.is_active = active;
        await team.update(obj, { where: { id: id } });

        //Delete all associations and recreate it.
        await teamAgentAssociation.destroy({ where: { [Op.and]: [{ team_id: id }, { tenant_id: tenantId }] } });
        //Insert Leads
        for (let i of leads) {
            const obj = {
                team_id: id,
                team_lead_id: i,
                department_id: departmentId,
                project_id: projectId,
                tenant_id: tenantId
            }
            await teamAgentAssociation.create(obj);
        }
        //Insert Agents
        for (let i of agents) {
            const obj = {
                team_id: id,
                agent_id: i,
                department_id: departmentId,
                project_id: projectId,
                tenant_id: tenantId
            }
            await teamAgentAssociation.create(obj);
        }
        //Insert users
        for (let i of users) {
            const obj = {
                team_id: id,
                user_id: i,
                department_id: departmentId,
                project_id: projectId,
                tenant_id: tenantId
            }
            await teamAgentAssociation.create(obj);
        }
        const createdTeam = await this.getTeamByName(teamName, tenantId);
        response = {
            status: true,
            data: createdTeam
        }
    } else {
        obj.created_by = loggedInUserId
        await team.create(obj);
        const createdTeam = await this.getTeamByName(teamName, tenantId);
        //Insert Leads
        for (let i of leads) {
            const obj = {
                team_id: createdTeam.id,
                team_lead_id: i,
                department_id: departmentId,
                project_id: projectId,
                tenant_id: tenantId
            }
            await teamAgentAssociation.create(obj);
        }
        //Insert Agents
        for (let i of agents) {
            const obj = {
                team_id: createdTeam.id,
                agent_id: i,
                department_id: departmentId,
                project_id: projectId,
                tenant_id: tenantId
            }
            await teamAgentAssociation.create(obj);
        }
        //Insert users
        for (let i of users) {
            const obj = {
                team_id: createdTeam.id,
                user_id: i,
                department_id: departmentId,
                project_id: projectId,
                tenant_id: tenantId
            }
            await teamAgentAssociation.create(obj);
        }
        response = {
            status: true,
            data: createdTeam
        }
    }

    return response
}
exports.getTeamById = async (id, tenantId) => {
    let response = null;
    let agentsArray = [];
    let leadsArray = [];
    let usersArray = [];
    const teamResp = await team.findOne({ where: { [Op.and]: [{ id: id }, { tenant_id: tenantId }] } });
    if (teamResp !== null) {
        response = teamResp.dataValues;

        const associationResp = await teamAgentAssociation.findAll({ where: { [Op.and]: [{ tenant_id: tenantId }, { team_id: id }] } });
        console.log(associationResp);
        for (let i of associationResp) {
            response.department_id = i.department_id;
            response.project_id = i.project_id;
            if (i.agent_id !== null) {
                agentsArray.push(i.agent_id);
            } else if (i.team_lead_id !== null) {
                leadsArray.push(i.team_lead_id);
            } else if (i.user_id !== null) {
                usersArray.push(i.user_id);
            }
        }
        response.users = usersArray;
        response.leads = leadsArray;
        response.agents = agentsArray;
    }
    return response;
}
exports.executeRawSelectQuery = async (query) => {
    const queryResp = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
    });
    return queryResp;
}