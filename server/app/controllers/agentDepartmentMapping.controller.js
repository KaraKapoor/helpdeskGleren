const { department } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;
const AgentDepartmentMapping = db.agentDepartmentMapping;
const User = db.user;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };
};

exports.createUpdate = async (req, res) => {
    const userIds = req.body.userIds;
    const departmentId = req.body.departmentId;
    const createdBy = req.body.createdBy;
    const updatedBy = req.body.updatedBy;

    try {
        /**Start--Mandatory params validation */
        if (userIds.length === 0 || userIds == null) {
            return res.send({ success: false, message: 'Following mandatory parameters not passed userIds' });
        }
        if (department === null) {
            return res.send({ success: false, message: 'Following mandatory parameters not passed departmentId' });
        }
        if (updatedBy === null) {
            return res.send({ success: false, message: 'Following mandatory parameters not passed updatedBy' });
        }
        /**End--Mandatory params validation */

        for (let id of userIds) {

            const existingRecord = await AgentDepartmentMapping.findOne({ where: { userId: id } });
            if (existingRecord) {
                const reqBody = {
                    userId: id,
                    departmentId: departmentId,
                    updatedBy: updatedBy
                }
                await AgentDepartmentMapping.update(reqBody, { where: { id: existingRecord.id } }).
                    then((resp) => {
                        console.log("AgentDepartment Mapping entry updated");
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.send({ success: false, message: "Some error occurred while performing the operation" });
                    })
            } else {

                const reqBody = {
                    userId: id,
                    departmentId: departmentId,
                    createdBy: createdBy,
                    updatedBy: updatedBy
                }
                await AgentDepartmentMapping.create(reqBody).
                    then((resp) => {
                        console.log("AgentDepartment Mapping entry inserted");
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.send({ success: false, message: "Some error occurred while performing the operation" });
                    })
            }
        }

        res.send({ success: true, message: "Agents mapped successfully" });
    } catch (err) {
        console.log(err);
        return res.send({ success: false, message: "Some error occurred while performing the operation" });
    }
}

exports.unassociatedAgents = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const queryParam = req.query.searchParam;
    const orderBy = req.query.orderBy;
    const orderDirection = req.query.orderDirection;
    let sortColumns;
    if (orderBy !== undefined && orderBy !== "undefined") {
        if (orderBy === 'email') {
            sortColumns=`t1.email ${orderDirection}`;
        } else if (orderBy === 'fullName') {
            sortColumns=`t1.fullName ${orderDirection}`;
        } else if (orderBy === 'mobile') {
            sortColumns=`t1.mobile ${orderDirection}`;
        } else if (orderBy === 'officeType') {
            sortColumns=`t1.officeType ${orderDirection}`;
        } else if (orderBy === 'designation') {
            sortColumns=`t1.designation ${orderDirection}`;
        }
        else {
            sortColumns= `'t1.'+${orderBy} ${orderDirection}`
        }

    } else {
        sortColumns = "t1.createdAt desc";
    }
    let queryCondition=`t1.isAgent='true'`
    if (queryParam !== "" && queryParam !== null && queryParam !== "undefined" && queryParam !== undefined) {
        queryCondition=`t1.isAgent='true' and (t1.email LIKE '${queryParam}%' or t1.fullName LIKE '${queryParam}%' or t1.mobile LIKE '${queryParam}%') `
    } 
    let totalRecordsQuery=`SELECT COUNT(t1.id) as count FROM users t1 LEFT JOIN agent_dept_Mappings t2 ON t2.userId = t1.id
    WHERE t2.userId IS NULL and ${queryCondition}`
    const queryResp1 = await db.sequelize.query(totalRecordsQuery, {
        type: db.sequelize.QueryTypes.SELECT,
    });
    let query=`SELECT t1.id,t1.email,t1.fullName,t1.mobile,t1.officeType,t1.designation,t1.isAgent,t1.employeeId
    FROM users t1
    LEFT JOIN agent_dept_Mappings t2 ON t2.userId = t1.id
    WHERE t2.userId IS NULL and ${queryCondition} order by ${sortColumns} LIMIT ${offset},${limit};`
    const queryResp = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
    });
    try {
        const obj = {
            count: queryResp1[0].count,
            rows: queryResp
        }
        const response = getPagingData(obj, page, limit);
        return res.send({ success: true, response });
    } catch (err) {
        console.log(err);
        return res.send({ success: false, message: "Some error occurred while performing the operation" });
    }
}

exports.associatedAgents = async (req, res) => {
    const departmentId = req.query.departmentId;
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const queryParam = req.query.searchParam;
    const orderBy = req.query.orderBy;
    const orderDirection = req.query.orderDirection;
    let sortColumns;
    if (orderBy !== undefined && orderBy !== "undefined") {
        if (orderBy === 'email') {
            sortColumns = [{ model: db.user }, "email", orderDirection];
        } else if (orderBy === 'fullName') {
            sortColumns = [{ model: db.user }, "fullName", orderDirection];
        } else if (orderBy === 'mobile') {
            sortColumns = [{ model: db.user }, "mobile", orderDirection];
        } else if (orderBy === 'officeType') {
            sortColumns = [{ model: db.user }, "officeType", orderDirection];
        } else if (orderBy === 'designation') {
            sortColumns = [{ model: db.user }, "designation", orderDirection];
        }
        else {
            sortColumns = [orderBy, orderDirection];
        }

    } else {
        sortColumns = ['createdAt', 'DESC'];
    }

    var condition = { [Op.and]: [{ departmentId: departmentId }] };
    if (queryParam !== "" && queryParam !== null && queryParam !== "undefined" && queryParam !== undefined) {
        var condition = { [Op.and]: [{ departmentId: departmentId }], [Op.or]: [{ '$user.email$':{[Op.startsWith]:'%'+`${queryParam}`}  }, { '$user.fullName$': {[Op.startsWith]:'%'+`${queryParam}`} }, { '$user.mobile$': {[Op.startsWith]:'%'+`${queryParam}`} }, { '$user.officeType$': {[Op.startsWith]:'%'+`${queryParam}`} }, { '$user.designation$': {[Op.startsWith]:'%'+`${queryParam}`} }], }
    }
    try {
        AgentDepartmentMapping.findAndCountAll({
            limit, offset, where: condition, include: [
                {
                    model: db.user,
                }
            ], order: [sortColumns,],
        })
            .then(data => {
                const response = getPagingData(data, page, limit);
                res.send(response);
            })
            .catch(err => {
                console.log(err);
                return res.send({ success: false, message: "Some error occurred while performing the operation" });
            });
    } catch (err) {
        console.log(err);
        return res.send({ success: false, message: "Some error occurred while performing the operation" });
    }

}

exports.getAllDepartmentsAgents = async (req, res) => {
    try {
        const resp = await AgentDepartmentMapping.findAll();
        let responseArray = [];
        for (let i of resp) {
            const userResp = await User.findByPk(i.dataValues.userId);
            responseArray.push({
                label: userResp.fullName,
                value: i.dataValues.userId,
                departmentId: i.dataValues.departmentId
            });
        }
        res.send({ success: true, agentDeptMap:responseArray });
    } catch (err) {
        console.log(err);
        return res.send({ success: false, message: "Some error occurred while performing the operation" });
    }
}