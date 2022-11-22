const db = require("../models");
const Op = db.Sequelize.Op;
const Teams = db.teams;
const User = db.user;
const TeamLeadAssociation = db.teamLeadAssociations;
const TeamLeadAgentDeptAssociations = db.teamLeadAgentDeptAssociations;
const Department = db.department;
const Tickets = db.ticket;
const constants = require("../constants/constants");
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: teams } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, teams, totalPages, currentPage };
};

exports.saveUpdate = async (req, res) => {

    try {
        console.log("*************************Save/Update Team API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const TeamName = req.body.teamName;
        const createdBy = req.body.createdBy;
        const updatedBy = req.body.updatedBy;
        const teamLeads = req.body.teamLeads;
        const agentsMap = req.body.agentsMap;
        var teamId = null;
        var isNew = true;

        if (req.body.id && req.body.id !== null && req.body.id !== undefined) {
            isNew = false;
            teamId = req.body.id;
        }

        //New Creation Flow
        if (isNew) {

            //Insert entry in Teams Table.
            const teamObj = {
                teamName: TeamName,
                createdBy: createdBy,
                updatedBy: updatedBy
            }
            const teamsResponse = await saveTeam(teamObj);

            //Insert entry in TeamLeadAssociation Table.

            for (let leadId of teamLeads) {
                const teamLeadAssociationObj = {
                    teamId: teamsResponse.id,
                    teamLeadId: leadId,
                }
                const teamLeadAssociationResp = await saveTeamLeadAssociations(teamLeadAssociationObj);

                //Insert entry in TeamLeadAgentDepartmentAssociation Table.
                for (let agentMap of agentsMap) {
                    const teamLeadAssociationDeptObj = {
                        teamLeadAssociationId: teamLeadAssociationResp.id,
                        teamId: teamsResponse.id,
                        teamLeadId: leadId,
                        agentId: agentMap.userId,
                        departmentId: agentMap.depId
                    }
                    const teamLeadAgentDeptAssociationsResp = await saveTeamLeadAgentDepartmentAssociations(teamLeadAssociationDeptObj);
                }

            }
            res.status(200).send({
                success: true,
                message: "Team created successfully",
            });
        }

        //Update Flow
        if (!isNew) {

            //Update entry in Teams Table.
            const teamObj = {
                teamName: TeamName,
                updatedBy: updatedBy
            }
            var teamsResponse = await updateTeam(teamObj, teamId);
            teamsResponse = await getTeamById(teamId);

            //Delete all associations & recreate them.
            const deleteCondition = { teamId: teamId };
            const teamlead_agnt_dept_associationsResp = await deleteTeamLeadAgentDepartmentAssociations(deleteCondition);

            const deleteCondition_1 = { teamId: teamId };
            const deleteTeamLeadAssociationsResp = await deleteTeamLeadAssociations(deleteCondition_1);


            //Insert new entry in TeamLeadAssociation Table.

            for (let leadId of teamLeads) {
                const teamLeadAssociationObj = {
                    teamId: teamsResponse.id,
                    teamLeadId: leadId,
                }
                const teamLeadAssociationResp = await saveTeamLeadAssociations(teamLeadAssociationObj);

                //Insert entry in TeamLeadAgentDepartmentAssociation Table.
                for (let agentMap of agentsMap) {
                    const teamLeadAssociationDeptObj = {
                        teamLeadAssociationId: teamLeadAssociationResp.id,
                        teamId: teamsResponse.id,
                        teamLeadId: leadId,
                        agentId: agentMap.userId,
                        departmentId: agentMap.depId
                    }
                    const teamLeadAgentDeptAssociationsResp = await saveTeamLeadAgentDepartmentAssociations(teamLeadAssociationDeptObj);
                }

            }
            res.status(200).send({
                success: true,
                message: "Team updated successfully",
            });
        }
        console.log("*************************Save/Update Team API Completed************************");
    } catch (err) {
        console.log("*************************Save/Update Team API Completed with Errors************************" + err);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}
exports.getById = async (req, res) => {
    try {
        console.log("*************************Find Team By Id API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const teamId = req.body.teamId;
        const teamResponse = await getTeamById(teamId);
        const teamAgentLeadDeptAssociations = await getLeadAgentDeptAssociations({ teamId: teamId });

        let responseObj = {
            id: teamId,
            teamName: teamResponse.teamName,
            teamLeads: [],
            agentsMap: [],
            createdBy: teamResponse.createdBy,
            updatedBy: teamResponse.updatedBy,
            selectedTeamLeads: [],
            selectedAgents: [],
            selectedDepartment: []
        }
        let teamLeads = new Set();
        let agentMap = [];
        let selectedAgents = [];
        let selectedDepartment = [];
        for (let i of teamAgentLeadDeptAssociations) {
            teamLeads.add(i.teamLeadId);
            let isMapValueExist = await containsObject({ userId: i.agentId, depId: i.departmentId }, agentMap);
            if (!isMapValueExist) {
                agentMap.push({
                    userId: i.agentId,
                    depId: i.departmentId
                })
                let agentResp = await getUserById(i.agentId);
                selectedAgents.push({ value: i.agentId, label: agentResp.fullName + `<${agentResp.email}>`, departmentId: i.departmentId });
            }

            let departmentResp = await getDepartmentById(i.departmentId);
            let isDepartmentValueExist = await containsObject({ value: departmentResp.id, label: departmentResp.departmentName }, selectedDepartment);
            if (!isDepartmentValueExist) {
                selectedDepartment.push({ value: departmentResp.id, label: departmentResp.departmentName });
            }



        }
        let leadIterator = teamLeads.values();
        let selectedTeamLeads = [];
        for (let leadId of leadIterator) {
            responseObj.teamLeads.push(leadId);
            const teamLeadResp = await getUserById(leadId);
            selectedTeamLeads.push({ value: leadId, label: teamLeadResp.fullName + `<${teamLeadResp.email}>` });
        }

        responseObj.agentsMap = agentMap;
        responseObj.selectedTeamLeads = selectedTeamLeads;
        responseObj.selectedAgents = selectedAgents;
        responseObj.selectedDepartment = selectedDepartment;
        res.status(200).send(responseObj);
        console.log("*************************Find Team By Id API Completed************************");
    } catch (err) {
        console.log("*************************Find Team By Id API Completed with Errors************************" + err);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        console.log("*************************Delete Team API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const teamId = req.body.teamId;
        //Delete all associations them.
        const deleteCondition = { teamId: teamId };
        const teamlead_agnt_dept_associationsResp = await deleteTeamLeadAgentDepartmentAssociations(deleteCondition);

        const deleteCondition_1 = { teamId: teamId };
        const deleteTeamLeadAssociationsResp = await deleteTeamLeadAssociations(deleteCondition_1);

        const deleteCondition_2 = { id: teamId };
        const deleteTeamResp = await deleteTeam(deleteCondition_2);

        console.log("*************************Delete Team API Completed************************");
        res.status(200).send({
            success: true,
            message: "Team deleted successfully",
        });
    }
    catch (err) {
        console.log("*************************Find User By Name API Completed with Errors************************" + err);
        console.log(err);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}

exports.getAll = async (req, res) => {
    try {
        console.log("*************************Find All Teams API Started************************");
        console.log("INPUT" + JSON.stringify(req.query));
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const queryParam = req.query.searchParam;
        let orderBy = req.query.orderBy;
        let orderDirection = req.query.orderDirection;
        let sortColumns;

        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'teamName') {
                sortColumns = ['teamName', orderDirection];
            } else if (orderBy === 'id') {
                sortColumns = ['id', orderDirection];
            } else if (orderBy === 'createdBy') {
                sortColumns = ['updatedBy', orderDirection];
            } else {
                sortColumns = [orderBy, orderDirection];
            }

        } else {
            sortColumns = ['createdAt', 'DESC'];
        }

        //Start-Condition One- (Search Param Only)
        var condition = undefined;
        if (queryParam !== "" && queryParam !== null && queryParam !== undefined) {
            condition = {
                [Op.or]: [
                    {
                        id: {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    },
                    {
                        teamName: {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    }
                ]
            }
        }
        //End- Condtion One
        const teamResp = await getAllTeams(limit, offset, condition, sortColumns);
        for (let i of teamResp.rows) {
            const createdByResp = await getUserById(i.createdBy);
            const updatedByResp = await getUserById(i.updatedBy);
            i.dataValues.createdByDetails = createdByResp.dataValues;
            i.dataValues.updatedByDetails = updatedByResp.dataValues;
        }
        const response = getPagingData(teamResp, page, limit);
        res.status(200).send(response);
        console.log("*************************Find All Teams API Completed************************");
    } catch (exception) {
        console.log("*************************Find All Teams API Completed with Errors************************" + exception);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}

exports.getTeamsByLeadId = async (req, res) => {
    try {
        console.log("*************************Find Teams Of Lead API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const teamLeadId = req.body.teamLeadId;
        const teamsLeadsResp = await TeamLeadAssociation.findAll({ where: { teamLeadId: teamLeadId } });
        let responseArray = [];
        for (let i of teamsLeadsResp) {
            let teamResp = await getTeamById(i.teamId);
            responseArray.push(teamResp);
        }
        res.status(200).send({
            success: true,
            data: responseArray
        });
        console.log("*************************Find Teams Of Lead API Completed************************");
    } catch (err) {
        console.log("*************************Find Teams Of Lead API Completed with Errors************************" + err);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}

exports.getTicketsOfTeam = async (req, res) => {
    try {
        console.log("*************************Find Tickets By Team Id API Started************************");
        console.log("INPUT" + JSON.stringify(req.query));
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);
        const queryParam = req.query.searchParam;
        let orderBy = req.query.orderBy;
        let orderDirection = req.query.orderDirection;
        let sortColumns;
        let ticketStatus = req.query.ticketStatus;
        const departmentId = req.query.departmentId;
        const assigneeId = req.query.assigneeId;
        let isTicketOverdue = req.query.isTicketOverdue;
        let createdStartDate = req.query.startDate;
        let createdEndDate = req.query.endDate;
        let closedStartDate = req.query.closedStartDate;
        let closedEndDate = req.query.closedEndDate;
        let createdDates = { createdAt: { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } };
        const userId= req.query.userId;
        const teamId = req.query.teamId;
        let showNestedTickets = req.query.showNestedTickets;
        const teamsAssociatedAgentsResp = await getLeadAgentDeptAssociations({ teamId: teamId });
        let agentsInTeam = new Set();
        let teamDepartmentId=[];
        for (let i of teamsAssociatedAgentsResp) {
            teamDepartmentId.push(i.dataValues.departmentId);
            agentsInTeam.add(i.dataValues.agentId);
            if(i.dataValues.teamLeadId===parseInt(userId)){
                agentsInTeam.add(i.dataValues.teamLeadId);//Show only current lead tickets.
            }


            if (showNestedTickets === 'true' || showNestedTickets === true) {
                //Check if agent is team lead in another team then add it's nested agents as well
                let Counter = 0;
                do {
                    const myIterator = agentsInTeam.values();
                    const agentsArray = [];
                    for (const i of myIterator) {
                        agentsArray.push(i);
                    }
                    currentlead = agentsArray[Counter];
                    if(currentlead===parseInt(userId)){
                        Counter++;
                        continue; //No need to fetch the nested teams of lead only agent is required.
                    }
                    const deptId= teamDepartmentId;
                    const nestedTeamMembersOfLeadResp = await TeamLeadAgentDeptAssociations.findAll({ where: { [Op.and]: [{ departmentId: { [Op.in]:  deptId  } }, { [Op.or]: [{ teamLeadId: currentlead }] }] } });
                    if (nestedTeamMembersOfLeadResp != null) {
                        for (let k of nestedTeamMembersOfLeadResp) {
                            agentsInTeam.add(k.dataValues.agentId);
                        }
                    }
                    Counter++;
                } while (Counter < agentsInTeam.size)
            }
        }
        let agentsInTeamIterator = agentsInTeam.values();
        let agentsArray = [];
        for (let id of agentsInTeamIterator) {
            agentsArray.push(id);
        }


        //Start filtering the tickets
        let nonEmptyKeys = [];
        nonEmptyKeys.push(createdDates);
        if (departmentId !== "undefined" && departmentId !== "" & departmentId !== null) {
            let departJson = { "departmentId": departmentId };
            nonEmptyKeys.push(departJson);
        }
        if (ticketStatus !== '' && ticketStatus !== 'All') {
            // let statusJson = { "ticketStatus": ticketStatus };
            // nonEmptyKeys.push(statusJson);
            const status = ticketStatus.split(",");
            let statusJson = { ticketStatus: { [Op.in]: status } };
            nonEmptyKeys.push(statusJson);
        }
        if (isTicketOverdue === 'Yes') {
            let overdueJson = { "isTicketOverdue": isTicketOverdue };
            nonEmptyKeys.push(overdueJson);
        } else if (isTicketOverdue === 'No') {
            let overdueJson = { "isTicketOverdue": null };
            nonEmptyKeys.push(overdueJson);
        }

        if (closedStartDate !== "undefined" && closedEndDate !== "undefined") {
            let closedDates = { closedDate: { [Op.between]: [`${closedStartDate}`, `${closedEndDate}`] } };
            nonEmptyKeys.push(closedDates);
        }
        if (assigneeId !== "undefined" && assigneeId !== "" & assigneeId !== null) {
            let assigneeJson = { "assigneeId": assigneeId };
            nonEmptyKeys.push(assigneeJson);
        }
        let filterTickets = {
            [Op.or]: [
                // {
                //     userId: agentsArray
                // },
                {
                    assigneeId: agentsArray
                }
            ]
        }
        nonEmptyKeys.push(filterTickets);
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'id') {
                sortColumns = ['id', orderDirection];
            } else if (orderBy === 'initialCreatedDate') {
                sortColumns = ['initialCreatedDate', orderDirection];
            } else if (orderBy === 'subject') {
                sortColumns = ['dynamicFormField1', orderDirection];
            } else if (orderBy === 'fullName') {
                sortColumns = ['fullName', orderDirection];
            }
            else {
                sortColumns = ['createdAt', 'DESC'];
            }
        } else {
            sortColumns = ['createdAt', 'DESC'];
        }
        var condition = { [Op.and]: nonEmptyKeys }

        //Start-Condition One- (Search Param Only)
        if (queryParam !== "" && queryParam !== null && queryParam !== undefined) {
            condition = {
                [Op.or]: [
                    {
                        id: {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    },
                    {
                        assigneeFullName: {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    },
                    {
                        '$user.mobile$': {
                            [Op.startsWith]: '%' + `${queryParam}`
                        }
                    }
                ]
            }
        }
        //End- Condtion One

        await Tickets.findAndCountAll({
            limit, offset, where: condition, include: [
                {
                    model: db.department,
                },
                {
                    model: db.helpTopic
                },
                {
                    model: db.user
                }
            ], order: [sortColumns,],
        })
            .then(data => {
                const response = getPagingData(data, page, limit);
                res.send(response);
            })
            .catch((err) => {
                console.log(err);
            })

        // if (orderBy !== undefined && orderBy !== "undefined") {
        //     if (orderBy === 'teamName') {
        //         sortColumns = ['teamName', orderDirection];
        //     } else if (orderBy === 'id') {
        //         sortColumns = ['id', orderDirection];
        //     } else if (orderBy === 'createdBy') {
        //         sortColumns = ['updatedBy', orderDirection];
        //     } else {
        //         sortColumns = [orderBy, orderDirection];
        //     }

        // } else {
        //     sortColumns = ['createdAt', 'DESC'];
        // }

        // //Start-Condition One- (Search Param Only)
        // var condition = undefined;
        // if (queryParam !== "" && queryParam !== null && queryParam !== undefined) {
        //     condition = {
        //         [Op.or]: [
        //             {
        //                 id: {
        //                     [Op.startsWith]: '%' + `${queryParam}`
        //                 }
        //             },
        //             {
        //                 teamName: {
        //                     [Op.startsWith]: '%' + `${queryParam}`
        //                 }
        //             }
        //         ]
        //     }
        // }
        // //End- Condtion One
        console.log("*************************Find Tickets By Team Id API Completed************************");
    }
    catch (err) {
        console.log("*************************Find Tickets By Team Id API Completed with Errors************************" + err);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}

exports.getAllAgentsInTeam = async (req, res) => {
    try {
        console.log("*************************Find Agents In Team API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const teamId = req.body.teamId;

        const response = await getLeadAgentDeptAssociations({ teamId: teamId });
        let agentsId = new Set();
        for (let id of response) {
            agentsId.add(id.dataValues.agentId);
        }
        let agentIterator = agentsId.values();
        let agentsList = [];
        for (let agentId of agentIterator) {
            const agentResp = await getUserById(agentId);
            agentsList.push(agentResp);
        }
        res.send(agentsList);
        console.log("*************************Find Agents In Team API Completed************************");
    } catch (err) {
        console.log("*************************Find Agents In Team API Completed with Errors************************" + err);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }


}
exports.getTeamsByDepartment = async (req, res) => {
    try {
        console.log("*************************Find Teams By Department API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const departmentIds = generalMethodsController.do_Null_Undefined_EmptyArray_Check(req.body.departmentIds);

        if (departmentIds == null) {
            return res.status(200).send({
                success: false,
                message: "Please enter Department Id",
            });
        }
        let query = `select  ta.id as teamId,ta.teamName from teamLead_agnt_dept_associations t ,departments d,teams ta 
        where t.departmentId in (${departmentIds}) and t.teamId=ta.id group by teamId;`
        const queryResponse = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (queryResponse !== null) {
            res.send(queryResponse);
        }
        console.log("*************************Find Teams By Department API Completed************************");
    } catch (exception) {
        console.log("*************************Find Teams By Department API Completed with Errors************************" + exception);
        res.status(200).send({
            success: false,
            message: "Some error occurred while retrieving.",
        });
    }
}
exports.findAllTeamLeadUsers = async (req, res) => {
    try {
        console.log("*************************Find All Team Leads API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const rolesToFind = ['Team Lead', 'Central Agent', 'Central Admin'];
        await User.findAll({ where: { [Op.and]: [{ isAgent: "true" }, { helpdeskRole: { [Op.in]: rolesToFind } }] } })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving.",
                });
            });
        console.log("*************************Find All Team Leads API Completed************************");
    } catch (exception) {
        console.log("*************************Find All Team Leads API Completed with Errors************************" + exception);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving.",
        });
    }

};
exports.findTeamLeadsByTeam = async (req, res) => {
    try {
        console.log("*************************Find All Team Leads By Team API Started************************");
        console.log("INPUT" + JSON.stringify(req.body));
        const teamIds= req.body.teamIds;
        if(teamIds==null || teamIds.length<=0){
            return res.send([]);
        }

        await TeamLeadAssociation.findAll({ where: { teamId: { [Op.in]: teamIds } }})
            .then(async(data) => {
                if(data!==null){
                    let leadId=[];
                    for(let i of data){
                        leadId.push(i.teamLeadId);
                        console.log(i);
                    }
                    const resp=await User.findAll({ where: { id: { [Op.in]: leadId } } });
                    res.send(resp);
                }

            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving.",
                });
            });
        console.log("*************************Find All Team Leads By Team API Completed************************");
        
    } catch (exception) {
        console.log("*************************Find All Team Leads By Team API Completed with Errors************************" + exception);
        res.status(500).send({
            message: "Some error occurred while retrieving.",
        });
    }
}
function getTeamById(id) {
    return Teams.findByPk(id);
}

function getAllTeams(limit, offset, condition, sortColumns) {
    return Teams.findAndCountAll({
        limit, offset, where: condition, order: [sortColumns],
    });
}

function saveTeam(obj) {
    return Teams.create(obj);
}

function updateTeam(obj, id) {
    return Teams.update(obj, { where: { id: id } });
}

function deleteTeam(condition) {
    return Teams.destroy({ where: condition })
}

function saveTeamLeadAssociations(obj) {
    return TeamLeadAssociation.create(obj)
}
function deleteTeamLeadAssociations(condition) {
    return TeamLeadAssociation.destroy({ where: condition })
}

function saveTeamLeadAgentDepartmentAssociations(obj) {
    return TeamLeadAgentDeptAssociations.create(obj)
}
function deleteTeamLeadAgentDepartmentAssociations(condition) {
    return TeamLeadAgentDeptAssociations.destroy({ where: condition });
}
function getLeadAgentDeptAssociations(condition) {
    return TeamLeadAgentDeptAssociations.findAll({ where: condition });
}

function getTeamLeadAssociations(condition) {
    return TeamLeadAssociation.findAll({ where: condition });
}

function getUserById(id) {
    return User.findByPk(id);
}

function containsObject(obj1, list) {
    for (let obj2 of list) {
        const obj1Length = Object.keys(obj1).length;
        const obj2Length = Object.keys(obj2).length;

        if (obj1Length === obj2Length) {
            if (Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj2[key] === obj1[key])) {
                return true;
            }
        }
    }
    return false;
}
function getDepartmentById(id) {
    return Department.findByPk(id);
}
