const db = require("../models");
const EscalatedTickets = db.escalatedTickets;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tickets } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, tickets, totalPages, currentPage };
};

exports.findAllEscalatedTicketsByLoggedInUser = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const loggedInUserEmail = req.query.userEmail;
    const queryParam = req.query.searchParam;
    let ticketStatus = req.query.ticketStatus;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let orderBy=req.query.orderBy;
    let orderDirection=req.query.orderDirection;
    let sortColumns;

    if (orderBy !== undefined && orderBy !== "undefined") {
        if (orderBy === 'ticketId') {
            sortColumns = ['ticketId', orderDirection];
        } else if (orderBy === 'subject') {
            sortColumns = [{ model: db.ticket }, "dynamicFormJson", orderDirection];
        } else if (orderBy === 'from') {
            sortColumns = [{ model: db.ticket }, "fullName", orderDirection];
        } else if (orderBy === 'departmentName') {
            sortColumns = [{ model: db.ticket }, "departmentId", orderDirection];
        } else if (orderBy === 'branch') {
            sortColumns = [{ model: db.ticket }, "branch", orderDirection];
        } else if (orderBy === 'schCol') {
            sortColumns = [{ model: db.ticket }, "schCol", orderDirection];
        } else if (orderBy === 'status') {
            sortColumns = [{ model: db.ticket }, "ticketStatus", orderDirection];
        } else if (orderBy === 'assigneeEmail') {
            sortColumns = ['assigneeEmail', orderDirection];
        } else if (orderBy === 'escalatedLevel') {
            sortColumns = ['escalatedLevel', orderDirection];
        } else if (orderBy === 'level1DueDate') {
            sortColumns = [{ model: db.ticket }, "level1SlaDue", orderDirection];
        } else if (orderBy === 'closedDate') {
            sortColumns = [{ model: db.ticket }, "closedDate", orderDirection];
        }
        else {
            sortColumns = ['createdAt', 'DESC'];
        }
    } else {
        sortColumns = ['createdAt', 'DESC'];
    }

    //Start-Condition One- (With Status "All")
    if (ticketStatus === "All" || ticketStatus==='') {
        var condition = { [Op.or]: [{ nextLevelEmail: `${loggedInUserEmail}` }, { assigneeEmail: `${loggedInUserEmail}` }], [Op.and]: [{ '$ticket.createdAt$': { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } }] }
    }
    //End- Condtion One

    //Start-Condition Two- (With Custom Status Only)
    else{
        const status = ticketStatus.split(",");
        var condition = { [Op.or]: [{ nextLevelEmail: `${loggedInUserEmail}` }, { assigneeEmail: `${loggedInUserEmail}` }], [Op.and]: [{ '$ticket.ticketStatus$': { [Op.in]: status } }, { '$ticket.createdAt$': { [Op.between]: [`${createdStartDate}`, `${createdEndDate}`] } }] }
    }
    //End- Condtion Two

    //Start-Condition Three- (Search Param Only)
    if (queryParam !== "" && queryParam !== null) {
        var condition = { [Op.or]: [{ nextLevelEmail: `${loggedInUserEmail}` }, { assigneeEmail: `${loggedInUserEmail}` }], [Op.and]: [{ ticketId: `${queryParam}` }] }
    }
    //End- Condtion Three

    EscalatedTickets.findAndCountAll({
        limit, offset, distinct: true, col: 'ticketId', where: condition, include: [
            {
                model: db.ticket,
                include: [db.department,db.user]
            },
        ], order: [sortColumns,],
    })
        .then(data => {
            const response = getPagingData(data, page, limit);
            /**Start-Sort the tickets and show only latest escalation level */
            let sortedArray = [];
            for (let i of response.tickets) {
                if (sortedArray.length === 0) {
                    sortedArray.push(i);
                } else {

                    let isValueExist = sortedArray.find((d) => d.ticketId === i.ticketId);
                    if (!isValueExist) {
                        sortedArray.push(i);
                    }
                    for (let j of sortedArray) {
                        if (j.ticketId === i.ticketId && (i.id > j.id)) {
                            let index = sortedArray.indexOf(j);
                            sortedArray.splice(index, 1);
                            sortedArray.push(i);
                        }
                    }
                }
            }
            response.tickets = sortedArray;
            /**End-Sort the tickets and show only latest escalation level */
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tickets."
            });
        });
};