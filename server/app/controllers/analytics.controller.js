const db = require("../models");
const constants = require("../constants/constants");
const excel = require("exceljs");
const generalMethodsController = require("../generalMethods/generalMethods.controller.js");
const larkIntegrationController = require("./larkIntegrationController.js");
const Ticket = db.ticket;
const TicketHistory = db.ticketHistory;
const EscalatedTickets = db.escalatedTickets;
const TeamLeadAgentDepartmentAssociation = db.teamLeadAgentDeptAssociations;
const TeamLeadAssociations = db.teamLeadAssociations;
const EmailTemplate = db.emailTemplate;
const Department = db.department;
const User = db.user;
const Op = db.Sequelize.Op;

exports.findAnalyticsForUser = async (req, res) => {
    const userId = req.query.userId;
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let isExport = req.query.isExport;
    let respArray = [];
    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;

    try {
        let selectDepartmentIdQuery = `SELECT id,departmentName FROM departments`;
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'DepartmentName') {
                selectDepartmentIdQuery = selectDepartmentIdQuery.concat(` order by departmentName ${orderDirection}`);
            }
        } else {
            selectDepartmentIdQuery = selectDepartmentIdQuery.concat(` order by createdAt desc`);
        }
        console.log(selectDepartmentIdQuery);
        const departmentsResp = await db.sequelize.query(selectDepartmentIdQuery, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        let counter = 1;
        for (let i of departmentsResp) {
            let totalDepartmentTicketsCount = 0;
            let totalDepartmentOpenCount = 0;
            let totalDepartmentClosedCount = 0;
            let totalDepartmentClosedPercentage = 0;
            let query = `SELECT count(id) from tickets where departmentId=${i.id} and ticketStatus not in ('closed') and userId=${userId}`
            query = query.concat(` and  createdAt between '${createdStartDate}' and '${createdEndDate}' `);
            const departmentsTicketsResp = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });
            let query1 = `SELECT count(id) from tickets where departmentId=${i.id} and ticketStatus in ('closed') and userId=${userId}`
            query1 = query1.concat(` and createdAt between '${createdStartDate}' and '${createdEndDate}' `);
            const departmentsTicketsResp1 = await db.sequelize.query(query1, {
                type: db.sequelize.QueryTypes.SELECT,
            });


            const openCount = generalMethodsController.getKeyFromDynamicFormJson(departmentsTicketsResp[0], "count(id)");
            const closedCount = generalMethodsController.getKeyFromDynamicFormJson(departmentsTicketsResp1[0], "count(id)");

            grandTotalCount = grandTotalCount + openCount + closedCount;
            grandTotalClosedCount = grandTotalClosedCount + closedCount;
            grandTotalOpenCount = grandTotalOpenCount + openCount;

            totalDepartmentTicketsCount = openCount + closedCount;
            totalDepartmentOpenCount = openCount;
            totalDepartmentClosedCount = closedCount;

            if (totalDepartmentClosedCount > 0 && totalDepartmentTicketsCount > 0) {
                totalDepartmentClosedPercentage = ((totalDepartmentClosedCount / totalDepartmentTicketsCount) * 100).toFixed(2);
            }


            respArray.push({
                "SNo": counter,
                "DepartmentName": i.departmentName,
                "OpenCount": totalDepartmentOpenCount,
                "ClosedCount": totalDepartmentClosedCount,
                "ClosedPercentage": totalDepartmentClosedPercentage + "%",
                "TotalTickets": totalDepartmentTicketsCount
            })
            counter++;
        }
        if (grandTotalClosedCount > 0 && grandTotalCount > 0) {
            grandTotalClosedPercentage = (grandTotalClosedCount / grandTotalCount * 100).toFixed(2);
        }

        //Same API is used for export as well.
        if (isExport) {
            respArray.push({
                "SNo": " ",
                "DepartmentName": "Total",
                "OpenCount": grandTotalOpenCount,
                "ClosedCount": grandTotalClosedCount,
                "ClosedPercentage": grandTotalClosedPercentage + "%",
                "TotalTickets": grandTotalCount
            })
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets");
            worksheet.columns = [
                { header: "S.No", key: "SNo", width: 30 },
                { header: "Department Name", key: "DepartmentName", width: 30 },
                { header: "Total Tickets", key: "TotalTickets", width: 30 },
                { header: "Open Count", key: "OpenCount", width: 30 },
                { header: "Closed Count", key: "ClosedCount", width: 30 },
                { header: "Closed Percentage", key: "ClosedPercentage", width: 30 },

            ];

            // Add Array Rows
            worksheet.addRows(respArray);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ServiceDeskAnalytics.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "TotalTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalTickets - a.TotalTickets)
            } else if (orderBy === "TotalTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalTickets - b.TotalTickets)
            } else if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "Data": sortedResp
            }]);
        }

    } catch (err) {
        console.log(err);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
};
exports.findAnalyticsForAgent = async (req, res) => {
    const userId = req.query.userId;
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let isExport = req.query.isExport;
    let respArray = [];

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;
    try {
        let selectDepartmentIdQuery = `select sum(1) as totalTicketCount,
        sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
        sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
        sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
        concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
        concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
        concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
        d.departmentName as departmentName,d.id as departmentId from tickets t ,departments d 
        where t.assigneeId=${userId} and t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId=d.id group by departmentName`;
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'DepartmentName') {
                selectDepartmentIdQuery = selectDepartmentIdQuery.concat(` order by d.departmentName ${orderDirection}`);
            }
        } else {
            selectDepartmentIdQuery = selectDepartmentIdQuery.concat(` order by d.createdAt desc`);
        }
        const departmentsResp = await db.sequelize.query(selectDepartmentIdQuery, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        console.log(departmentsResp);
        let counter = 1;
        for (let i of departmentsResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalTicketCount);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            let query = `select 
            COALESCE(sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as zeroday,
            COALESCE(sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as oneday,
            COALESCE(sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as twoday,
            COALESCE(sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as threeday,
            COALESCE(sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as fourday,
            COALESCE(sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as fiveday,
            COALESCE(sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as sixday,
            COALESCE(sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as sevenday,
            COALESCE(sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ),0) as sevenplusday,
            concat(COALESCE(round(( sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS zeroday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS oneday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS twoday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS threeday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS fourday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS fiveday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS sixday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS sevenday_percentage,
        concat(COALESCE(round(( sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS sevenplusday_percentage
    from 
        (
            select datediff(case when closedDate is null then now() else closedDate end, level1SlaDue) diff_date,closedDate,isTicketOverdue,ticketStatus
            From  tickets 
            where assigneeId=${userId} and departmentId=${i.departmentId} and  createdAt between '${createdStartDate}' and '${createdEndDate}' and isTicketOverdue='Yes'
        ) tmp`
            const queryResp = await db.sequelize.query(query, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            //Closed ticket aging query
            let query1 = `select 	
            COALESCE(sum(case when diff_date < 1 then 1 else 0 end ),0) as zeroday,
            COALESCE(sum(case when diff_date = 1 then 1 else 0 end ),0) as oneday,
            COALESCE(sum(case when diff_date = 2 then 1 else 0 end ),0) as twoday,
            COALESCE(sum(case when diff_date = 3 then 1 else 0 end ),0) as threeday,
            COALESCE(sum(case when diff_date = 4 then 1 else 0 end ),0) as fourday,
            COALESCE(sum(case when diff_date = 5 then 1 else 0 end ),0) as fiveday,
            COALESCE(sum(case when diff_date = 6 then 1 else 0 end ),0) as sixday,
            COALESCE(sum(case when diff_date = 7 then 1 else 0 end ),0) as sevenday,
            COALESCE(sum(case when diff_date > 7 then 1 else 0 end ),0) as sevenplusday,
            concat(COALESCE(round(( sum(case when diff_date < 1 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS zeroday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 1 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS oneday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 2 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS twoday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 3 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS threeday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 4 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS fourday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 5 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS fiveday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 6 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS sixday_percentage,
        concat(COALESCE(round(( sum(case when diff_date = 7 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS sevenday_percentage,
        concat(COALESCE(round(( sum(case when diff_date > 7 then 1 else 0 end )/sum(1) * 100 ),2),0),'%') AS sevenplusday_percentage
    from 
        (
            select datediff(case when closedDate is null then now() else closedDate end, initialCreatedDate) diff_date
            From  tickets 
            where assigneeId=${userId} and departmentId=${i.departmentId} and  createdAt between '${createdStartDate}' and '${createdEndDate}' and closedDate is not null
        ) tmp;`
            const query1Resp = await db.sequelize.query(query1, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            respArray.push({
                "SNo": counter,
                "DepartmentName": i.departmentName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalTicketCount,
                "OverdueAging": queryResp,
                "ClosedAging": query1Resp,
            })
            counter++;
        }

        //Same API is used for export as well.
        if (isExport) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.mergeCells('I1', 'Q1');
            worksheet.getCell('I1').value = 'Aging Analysis of Overdue tickets In Numbers'
            worksheet.mergeCells('R1', 'Z1');
            worksheet.getCell('R1').value = 'Aging Analysis of Overdue tickets in %'

            worksheet.mergeCells('AA1', 'AI1');
            worksheet.getCell('AA1').value = 'Aging Analysis of Closed tickets In Numbers'
            worksheet.mergeCells('AJ1', 'AR1');
            worksheet.getCell('AJ1').value = 'Aging Analysis of Closed tickets in %'

            /*Column headers*/
            worksheet.getRow(2).values = ['S.No', 'Department', 'Total Tickets Assigned', 'Open', 'Closed', 'Overdue', '% Closed', '% Overdue', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days'];

            worksheet.getRow(2).font = { bold: true };
            worksheet.getRow(1).font = { bold: true };
            worksheet.columns = [
                { key: 'SNo' },
                { key: 'Department' },
                { key: 'TotalAssignedTickets' },
                { key: 'Open' },
                { key: 'Closed' },
                { key: 'Overdue' },
                { key: 'ClosedPercent' },
                { key: 'OverduePercent' },
                { key: 'OverdueZeroDay' },
                { key: 'OverdueOneDay' },
                { key: 'OverdueTwoDay' },
                { key: 'OverdueThreeDay' },
                { key: 'OverdueFourDay' },
                { key: 'OverdueFiveDay' },
                { key: 'OverdueSixDay' },
                { key: 'OverdueSevenDay' },
                { key: 'OverdueGreaterSevenDay' },
                { key: 'OverdueZeroPercent' },
                { key: 'OverdueOnePercent' },
                { key: 'OverdueTwoPercent' },
                { key: 'OverdueThreePercent' },
                { key: 'OverdueFourPercent' },
                { key: 'OverdueFivePercent' },
                { key: 'OverdueSixPercent' },
                { key: 'OverdueSevenPercent' },
                { key: 'OverdueGreaterSevenPercent' },
                { key: 'ClosedZeroDay' },
                { key: 'ClosedOneDay' },
                { key: 'ClosedTwoDay' },
                { key: 'ClosedThreeDay' },
                { key: 'ClosedFourDay' },
                { key: 'ClosedFiveDay' },
                { key: 'ClosedSixDay' },
                { key: 'ClosedSevenDay' },
                { key: 'ClosedGreaterSevenDay' },
                { key: 'ClosedZeroPercent' },
                { key: 'ClosedOnePercent' },
                { key: 'ClosedTwoPercent' },
                { key: 'ClosedThreePercent' },
                { key: 'ClosedFourPercent' },
                { key: 'ClosedFivePercent' },
                { key: 'ClosedSixPercent' },
                { key: 'ClosedSevenPercent' },
                { key: 'ClosedGreaterSevenPercent' },
            ]


            //<Start--Overdue Row>    
            respArray.forEach(function (item, index) {
                worksheet.addRow({
                    'SNo': item.SNo,
                    'Department': item.DepartmentName,
                    'TotalAssignedTickets': item.TotalAssignedTickets,
                    'Open': item.OpenCount,
                    'Closed': item.ClosedCount,
                    'Overdue': item.OverdueCount,
                    'ClosedPercent': item.ClosedPercentage,
                    'OverduePercent': item.OverduePercentage,
                    'OverdueZeroDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday),
                    'OverdueOneDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday),
                    'OverdueTwoDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday),
                    'OverdueThreeDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday),
                    'OverdueFourDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday),
                    'OverdueFiveDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday),
                    'OverdueSixDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday),
                    'OverdueSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday),
                    'OverdueGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday),
                    'OverdueZeroPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday_percentage),
                    'OverdueOnePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday_percentage),
                    'OverdueTwoPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday_percentage),
                    'OverdueThreePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday_percentage),
                    'OverdueFourPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday_percentage),
                    'OverdueFivePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday_percentage),
                    'OverdueSixPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday_percentage),
                    'OverdueSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday_percentage),
                    'OverdueGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday_percentage),

                    'ClosedZeroDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday),
                    'ClosedOneDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday),
                    'ClosedTwoDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday),
                    'ClosedThreeDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday),
                    'ClosedFourDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday),
                    'ClosedFiveDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday),
                    'ClosedSixDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday),
                    'ClosedSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday),
                    'ClosedGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday),
                    'ClosedZeroPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday_percentage),
                    'ClosedOnePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday_percentage),
                    'ClosedTwoPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday_percentage),
                    'ClosedThreePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday_percentage),
                    'ClosedFourPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday_percentage),
                    'ClosedFivePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday_percentage),
                    'ClosedSixPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday_percentage),
                    'ClosedSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday_percentage),
                    'ClosedGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday_percentage),
                })

            })

            //Add Total Count row in last
            worksheet.addRow({
                'SNo': ' ',
                'Department': 'Total',
                'TotalAssignedTickets': grandTotalCount,
                'Open': grandTotalOpenCount,
                'Closed': grandTotalClosedCount,
                'Overdue': grandTotalOpenCount,
                'ClosedPercent': grandTotalClosedPercentage + '%',
                'OverduePercent': grandTotalOverduePercentage + '%',
            })
            //<End--Overdue Row>    



            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ServiceDeskAnalytics.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }
    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });

    }

}

exports.findAnalyticsForAgentWithHelptopic = async (req, res) => {
    const userId = req.query.userId;
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentIds = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let helptopicIds = generalMethodsController.convertCommaSeparatedStringToArray(req.query.helptopicIds);
    let isExport = false;
    isExport = req.query.isExport;

    //Validations
    helptopicIds = generalMethodsController.do_Null_Undefined_EmptyArray_Check(helptopicIds);
    departmentIds = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentIds);

    try {
        let finalQuery = ``;
        let query = `select 
            sum(1) as totalTicketCount,
            sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
            sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
            sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
            concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
            concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
            concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
            d.departmentName,h.helpTopicName,d.id as departmentId,h.id as helptopicId from tickets t ,departments d,helptopics h where 1=1`
        finalQuery = finalQuery.concat(query);
        if (departmentIds !== null) {
            finalQuery = finalQuery.concat(` and d.id in(${departmentIds})`);
        }

        if (helptopicIds !== null) {
            finalQuery = finalQuery.concat(` and h.id in(${helptopicIds})`)
        }

        finalQuery = finalQuery.concat(` and t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.assigneeId=${userId} and t.departmentId=d.id
        and t.helpTopicId=h.id
        and d.id=h.departmentId
        group by d.departmentName, h.helpTopicName`);

        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'DepartmentName' || orderBy === 'HelpTopicName') {
                finalQuery = finalQuery.concat(` order by d.departmentName ${orderDirection}`);
            }
        } else {
            finalQuery = finalQuery.concat(` order by d.createdAt desc`);
        }
        //End--OrdeBy Clause

        const queryResponse = await db.sequelize.query(finalQuery, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        // Process Response
        let respArray = [];
        let grandTotalCount = 0;
        let grandTotalOpenCount = 0;
        let grandTotalOpenPercentage = 0;
        let grandTotalClosedCount = 0;
        let grandTotalClosedPercentage = 0;
        let grandTotalOverdueCount = 0;
        let grandTotalOverduePercentage = 0;
        for (const i of queryResponse) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalTicketCount);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalOpenPercentage = generalMethodsController.findPercentage(parseInt(grandTotalOpenCount), parseInt(grandTotalCount));
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "DepartmentName": i.departmentName,
                "HelpTopicName": i.helpTopicName,
                "TotalTickets": parseInt(i.totalTicketCount),
                "OpenTickets": parseInt(i.openTickets),
                "ClosedTickets": parseInt(i.closedTickets),
                "OverdueTickets": parseInt(i.overdueTickets),
                "ClosedTicketsPercent": i.closedTicketPercent,
                "OverdueTicketsPercent": i.overdueTicketPercent,
                "OpenTicketsPercent": i.openTicketPercent,
            })


        }
        if (isExport) {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.columns = [
                { header: 'Department', key: 'DepartmentName' },
                { header: 'Helptopic', key: 'HelpTopicName' },
                { header: 'Total Tickets', key: 'TotalTickets' },
                { header: 'Open', key: 'OpenTickets' },
                { header: 'Closed', key: 'ClosedTickets' },
                { header: 'Overdue', key: 'OverdueTickets' },
                { header: '% Closed', key: 'ClosedTicketsPercent' },
                { header: '% Overdue', key: 'OverdueTicketsPercent' },
                { header: '% In Progress', key: 'OpenTicketsPercent' },
            ];
            worksheet.getRow(1).font = { bold: true };
            worksheet.addRows(respArray);

            //Add Total Count row in last
            worksheet.addRow({
                'DepartmentName': ' ',
                'HelpTopicName': 'Total',
                'TotalTickets': grandTotalCount,
                'OpenTickets': grandTotalOpenCount,
                'ClosedTickets': grandTotalClosedCount,
                'OverdueTickets': grandTotalOverdueCount,
                'ClosedTicketsPercent': grandTotalClosedPercentage + '%',
                'OverdueTicketsPercent': grandTotalOverduePercentage + '%',
                'OpenTicketsPercent': grandTotalOpenPercentage + '%',
            })
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ServiceDeskAnalytics.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "TotalTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalTickets - a.TotalTickets)
            } else if (orderBy === "TotalTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalTickets - b.TotalTickets)
            } else if (orderBy === "OpenTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenTickets - a.OpenTickets)
            } else if (orderBy === "OpenTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenTickets - b.OpenTickets)
            } else if (orderBy === "ClosedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedTickets - a.ClosedTickets)
            } else if (orderBy === "ClosedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedTickets - b.ClosedTickets)
            } else if (orderBy === "OverdueTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueTickets - a.OverdueTickets)
            } else if (orderBy === "OverdueTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueTickets - b.OverdueTickets)
            } else if (orderBy === "ClosedTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedTicketsPercent)))
            } else if (orderBy === "ClosedTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedTicketsPercent)))
            } else if (orderBy === "OverdueTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverdueTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverdueTicketsPercent)))
            } else if (orderBy === "OverdueTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverdueTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverdueTicketsPercent)))
            } else if (orderBy === "OpenTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OpenTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OpenTicketsPercent)))
            } else if (orderBy === "OpenTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OpenTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OpenTicketsPercent)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.status(200).send({
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "GrandOpenPercentage": grandTotalOpenPercentage + "%",
                "Data": sortedResp
            });
        }

    } catch (err) {
        console.log(err);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForTeamLeadWithDepartment = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }
    try {

        let query = `select  departmentId, departmentName, teamName,
		sum(1) as totalinrow,
        sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
        sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
        sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
        concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
        concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
        concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
		sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as zeroday,
		sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as oneday,
		sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as twoday,
		sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as threeday,
		sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fourday,
		sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fiveday,
		sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sixday,
		sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenday,
		sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenplusday,
        concat(round(( sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
        concat(round(( sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
        concat(round(( sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
        concat(round(( sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
        concat(round(( sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
        concat(round(( sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
        concat(round(( sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
        concat(round(( sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
        concat(round(( sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage
from 
	(
		select datediff(case when closedDate is null then now() else closedDate end, level1SlaDue) diff_date, t.departmentId, d.departmentName, tm.teamName,t.closedDate,t.isTicketOverdue,t.ticketStatus
		From  tickets t, departments  d, teamLead_agnt_dept_associations ass, teams tm 
		where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and d.id = ass.departmentId and ass.teamId=tm.id`

        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        query = query +
            ` and ass.agentId=t.assigneeId
	      and ass.teamLeadId=${userId}
	  ) tmp group by departmentId, departmentName, teamName`
        if (orderBy === "DepartmentName") {
            query = query.concat(` order by d.departmentName ${orderDirection}`);
        } else if (orderBy === "TeamName") {
            query = query.concat(` order by tm.teamName ${orderDirection}`);
        }
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });


        //Closed Tickets aging query
        let query1 = `select  departmentId, departmentName, teamName,
		sum(1) as totalinrow,
        sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
        sum(case when closedDate is null then 1 else 0 end ) as openTickets,
        sum(case when isTicketOverdue is not null then 1 else 0 end )as overdueTickets,
        concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
        concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
        concat(round(( sum(case when isTicketOverdue is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
		sum(case when diff_date < 1 then 1 else 0 end ) as zeroday,
		sum(case when diff_date = 1 then 1 else 0 end ) as oneday,
		sum(case when diff_date = 2 then 1 else 0 end ) as twoday,
		sum(case when diff_date = 3 then 1 else 0 end ) as threeday,
		sum(case when diff_date = 4 then 1 else 0 end ) as fourday,
		sum(case when diff_date = 5 then 1 else 0 end ) as fiveday,
		sum(case when diff_date = 6 then 1 else 0 end ) as sixday,
		sum(case when diff_date = 7 then 1 else 0 end ) as sevenday,
		sum(case when diff_date > 7 then 1 else 0 end ) as sevenplusday,
        concat(round(( sum(case when diff_date < 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
        concat(round(( sum(case when diff_date = 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
        concat(round(( sum(case when diff_date = 2 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
        concat(round(( sum(case when diff_date = 3 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
        concat(round(( sum(case when diff_date = 4 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
        concat(round(( sum(case when diff_date = 5 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
        concat(round(( sum(case when diff_date = 6 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
        concat(round(( sum(case when diff_date = 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
        concat(round(( sum(case when diff_date > 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage
from 
	(
		select datediff(case when closedDate is null then now() else closedDate end, initialCreatedDate) diff_date, t.departmentId, d.departmentName, tm.teamName,t.closedDate,t.isTicketOverdue
		From  tickets t, departments  d, teamLead_agnt_dept_associations ass, teams tm 
		where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and d.id = ass.departmentId and ass.teamId=tm.id and t.closedDate is not null`

        if (departmentId !== null) {
            query1 = query1 + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query1 = query1 + ` and tm.id IN (${teams})`
        }
        query1 = query1 +
            ` and ass.agentId=t.assigneeId
	      and ass.teamLeadId=${userId}
	  ) tmp group by departmentId, departmentName, teamName;`
        const queryResp1 = await db.sequelize.query(query1, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "SNo": counter,
                "DepartmentName": i.departmentName,
                "TeamName": i.teamName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "OverdueAging": [{
                    "zeroday": i.zeroday,
                    "oneday": i.oneday,
                    "twoday": i.twoday,
                    "threeday": i.threeday,
                    "fourday": i.fourday,
                    "fiveday": i.fiveday,
                    "sixday": i.sixday,
                    "sevenday": i.sevenday,
                    "sevenplusday": i.sevenplusday,
                    "zeroday_percentage": i.zeroday_percentage,
                    "oneday_percentage": i.oneday_percentage,
                    "twoday_percentage": i.twoday_percentage,
                    "threeday_percentage": i.threeday_percentage,
                    "fourday_percentage": i.fourday_percentage,
                    "fiveday_percentage": i.fiveday_percentage,
                    "sixday_percentage": i.sixday_percentage,
                    "sevenday_percentage": i.sevenday_percentage,
                    "sevenplusday_percentage": i.sevenplusday_percentage
                }],
                "ClosedAging": [
                    {
                        "zeroday": 0,
                        "oneday": 0,
                        "twoday": 0,
                        "threeday": 0,
                        "fourday": 0,
                        "fiveday": 0,
                        "sixday": 0,
                        "sevenday": 0,
                        "sevenplusday": 0,
                        "zeroday_percentage": "0.00%",
                        "oneday_percentage": "0.00%",
                        "twoday_percentage": "0.00%",
                        "threeday_percentage": "0.00%",
                        "fourday_percentage": "0.00%",
                        "fiveday_percentage": "0.00%",
                        "sixday_percentage": "0.00%",
                        "sevenday_percentage": "0.00%",
                        "sevenplusday_percentage": "0.00%"
                    }
                ]
            })
            counter++;
        }
        for (let j of queryResp1) {
            for (var k = 0; k < respArray.length; k++) {
                if (j.departmentName === respArray[k].DepartmentName) {
                    respArray[k].ClosedAging = [
                        {
                            "zeroday": j.zeroday,
                            "oneday": j.oneday,
                            "twoday": j.twoday,
                            "threeday": j.threeday,
                            "fourday": j.fourday,
                            "fiveday": j.fiveday,
                            "sixday": j.sixday,
                            "sevenday": j.sevenday,
                            "sevenplusday": j.sevenplusday,
                            "zeroday_percentage": j.zeroday_percentage,
                            "oneday_percentage": j.oneday_percentage,
                            "twoday_percentage": j.twoday_percentage,
                            "threeday_percentage": j.threeday_percentage,
                            "fourday_percentage": j.fourday_percentage,
                            "fiveday_percentage": j.fiveday_percentage,
                            "sixday_percentage": j.sixday_percentage,
                            "sevenday_percentage": j.sevenday_percentage,
                            "sevenplusday_percentage": j.sevenplusday_percentage
                        }
                    ]
                }
            }
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.mergeCells('J1', 'R1');
            worksheet.getCell('J1').value = 'Aging Analysis of Overdue tickets In Numbers'
            worksheet.mergeCells('S1', 'AA1');
            worksheet.getCell('S1').value = 'Aging Analysis of Overdue tickets in %'

            worksheet.mergeCells('AB1', 'AJ1');
            worksheet.getCell('AB1').value = 'Aging Analysis of Closed tickets In Numbers'
            worksheet.mergeCells('AK1', 'AS1');
            worksheet.getCell('AK1').value = 'Aging Analysis of Closed tickets in %'

            /*Column headers*/
            worksheet.getRow(2).values = ['S.No', 'Department', 'Team Name', 'Total Tickets Assigned', 'Open', 'Closed', 'Overdue', '% Closed', '% Overdue', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days'];

            worksheet.getRow(2).font = { bold: true };
            worksheet.getRow(1).font = { bold: true };
            worksheet.columns = [
                { key: 'SNo' },
                { key: 'Department' },
                { key: 'TeamName' },
                { key: 'TotalAssignedTickets' },
                { key: 'Open' },
                { key: 'Closed' },
                { key: 'Overdue' },
                { key: 'ClosedPercent' },
                { key: 'OverduePercent' },
                { key: 'OverdueZeroDay' },
                { key: 'OverdueOneDay' },
                { key: 'OverdueTwoDay' },
                { key: 'OverdueThreeDay' },
                { key: 'OverdueFourDay' },
                { key: 'OverdueFiveDay' },
                { key: 'OverdueSixDay' },
                { key: 'OverdueSevenDay' },
                { key: 'OverdueGreaterSevenDay' },
                { key: 'OverdueZeroPercent' },
                { key: 'OverdueOnePercent' },
                { key: 'OverdueTwoPercent' },
                { key: 'OverdueThreePercent' },
                { key: 'OverdueFourPercent' },
                { key: 'OverdueFivePercent' },
                { key: 'OverdueSixPercent' },
                { key: 'OverdueSevenPercent' },
                { key: 'OverdueGreaterSevenPercent' },
                { key: 'ClosedZeroDay' },
                { key: 'ClosedOneDay' },
                { key: 'ClosedTwoDay' },
                { key: 'ClosedThreeDay' },
                { key: 'ClosedFourDay' },
                { key: 'ClosedFiveDay' },
                { key: 'ClosedSixDay' },
                { key: 'ClosedSevenDay' },
                { key: 'ClosedGreaterSevenDay' },
                { key: 'ClosedZeroPercent' },
                { key: 'ClosedOnePercent' },
                { key: 'ClosedTwoPercent' },
                { key: 'ClosedThreePercent' },
                { key: 'ClosedFourPercent' },
                { key: 'ClosedFivePercent' },
                { key: 'ClosedSixPercent' },
                { key: 'ClosedSevenPercent' },
                { key: 'ClosedGreaterSevenPercent' },
            ]


            //<Start--Overdue Row>    
            respArray.forEach(function (item, index) {
                worksheet.addRow({
                    'SNo': item.SNo,
                    'Department': item.DepartmentName,
                    'TeamName': item.TeamName,
                    'TotalAssignedTickets': item.TotalAssignedTickets,
                    'Open': item.OpenCount,
                    'Closed': item.ClosedCount,
                    'Overdue': item.OverdueCount,
                    'ClosedPercent': item.ClosedPercentage,
                    'OverduePercent': item.OverduePercentage,
                    'OverdueZeroDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday),
                    'OverdueOneDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday),
                    'OverdueTwoDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday),
                    'OverdueThreeDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday),
                    'OverdueFourDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday),
                    'OverdueFiveDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday),
                    'OverdueSixDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday),
                    'OverdueSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday),
                    'OverdueGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday),
                    'OverdueZeroPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday_percentage),
                    'OverdueOnePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday_percentage),
                    'OverdueTwoPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday_percentage),
                    'OverdueThreePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday_percentage),
                    'OverdueFourPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday_percentage),
                    'OverdueFivePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday_percentage),
                    'OverdueSixPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday_percentage),
                    'OverdueSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday_percentage),
                    'OverdueGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday_percentage),

                    'ClosedZeroDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday),
                    'ClosedOneDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday),
                    'ClosedTwoDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday),
                    'ClosedThreeDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday),
                    'ClosedFourDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday),
                    'ClosedFiveDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday),
                    'ClosedSixDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday),
                    'ClosedSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday),
                    'ClosedGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday),
                    'ClosedZeroPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday_percentage),
                    'ClosedOnePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday_percentage),
                    'ClosedTwoPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday_percentage),
                    'ClosedThreePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday_percentage),
                    'ClosedFourPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday_percentage),
                    'ClosedFivePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday_percentage),
                    'ClosedSixPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday_percentage),
                    'ClosedSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday_percentage),
                    'ClosedGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday_percentage),
                })

            })

            //Add Total Count row in last
            worksheet.addRow({
                'SNo': ' ',
                'Department': 'Total',
                'TeamName': '-',
                'TotalAssignedTickets': grandTotalCount,
                'Open': grandTotalOpenCount,
                'Closed': grandTotalClosedCount,
                'Overdue': grandTotalOpenCount,
                'ClosedPercent': grandTotalClosedPercentage + '%',
                'OverduePercent': grandTotalOverduePercentage + '%',
            })
            //<End--Overdue Row>    



            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ticketsAnalysis.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "OverduePercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForTeamLeadWithHelptopic = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let helptopicId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.helptopicIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let isExport = req.query.isExport;
    let respArray = [];

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    helptopicId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(helptopicId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([]);
    }

    try {

        let query = `select helpTopicId,helpTopicName, departmentId, departmentName, teamName,
		sum(1) as totalTicketCount,
        sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
        sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
        sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
        concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
        concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
        concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent
from 
	(
		select helpTopicId,h.helpTopicName, t.departmentId, d.departmentName, tm.teamName,t.closedDate,t.isTicketOverdue,t.ticketStatus
		From  tickets t, departments  d, teamLead_agnt_dept_associations ass, teams tm, helptopics h
		where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and d.id = ass.departmentId and ass.teamId=tm.id and t.helpTopicId =h.id and h.departmentId=d.id`

        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        if (helptopicId !== null) {
            query = query + ` and helpTopicId IN (${helptopicId})`
        }
        query = query +
            ` and ass.agentId=t.assigneeId
	      and ass.teamLeadId=${userId}
	  ) tmp group by departmentId,helpTopicId, departmentName, teamName`
        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'DepartmentName' || orderBy === 'HelpTopicName') {
                query = query.concat(` order by d.departmentName ${orderDirection}`);
            } else if (orderBy === 'TeamName') {
                query = query.concat(` order by tm.teamName ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        console.log(queryResp);
        let grandTotalCount = 0;
        let grandTotalOpenCount = 0;
        let grandTotalOpenPercentage = 0;
        let grandTotalClosedCount = 0;
        let grandTotalClosedPercentage = 0;
        let grandTotalOverdueCount = 0;
        let grandTotalOverduePercentage = 0;

        for (const i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalTicketCount);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalOpenPercentage = generalMethodsController.findPercentage(parseInt(grandTotalOpenCount), parseInt(grandTotalCount));
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "DepartmentName": i.departmentName,
                "TeamName": i.teamName,
                "HelpTopicName": i.helpTopicName,
                "TotalTickets": parseInt(i.totalTicketCount),
                "OpenTickets": parseInt(i.openTickets),
                "ClosedTickets": parseInt(i.closedTickets),
                "OverdueTickets": parseInt(i.overdueTickets),
                "ClosedTicketsPercent": i.closedTicketPercent,
                "OverdueTicketsPercent": i.overdueTicketPercent,
                "OpenTicketsPercent": i.openTicketPercent
            })


        }
        if (isExport === "true") {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.columns = [
                { header: 'Department', key: 'DepartmentName' },
                { header: 'Team Name', key: 'TeamName' },
                { header: 'Helptopic', key: 'HelpTopicName' },
                { header: 'Total Tickets', key: 'TotalTickets' },
                { header: 'Open', key: 'OpenTickets' },
                { header: 'Closed', key: 'ClosedTickets' },
                { header: 'Overdue', key: 'ClosedTicketsPercent' },
                { header: '% Closed', key: 'closedPercent' },
                { header: '% Overdue', key: 'OverdueTicketsPercent' },
                { header: '% In Progress', key: 'OpenTicketsPercent' },
            ];
            worksheet.columns.forEach(column => {
                column.width = column.header.length < 12 ? 12 : column.header.length
            })
            worksheet.getRow(1).font = { bold: true };

            worksheet.addRows(respArray);

            //Add Total Count row in last
            worksheet.addRow({
                'DepartmentName': ' ',
                'HelpTopicName': 'Total',
                'TotalTickets': grandTotalCount,
                'OpenTickets': grandTotalOpenCount,
                'ClosedTickets': grandTotalClosedCount,
                'OverdueTickets': grandTotalOverdueCount,
                'ClosedTicketsPercent': grandTotalClosedPercentage + '%',
                'OverdueTicketsPercent': grandTotalOverduePercentage + '%',
                'OpenTicketsPercent': grandTotalOpenPercentage + '%',
            })
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ServiceDeskAnalytics.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "TotalTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalTickets - a.TotalTickets)
            } else if (orderBy === "TotalTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalTickets - b.TotalTickets)
            } else if (orderBy === "OpenTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenTickets - a.OpenTickets)
            } else if (orderBy === "OpenTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenTickets - b.OpenTickets)
            } else if (orderBy === "ClosedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedTickets - a.ClosedTickets)
            } else if (orderBy === "ClosedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedTickets - b.ClosedTickets)
            } else if (orderBy === "OverdueTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueTickets - a.OverdueTickets)
            } else if (orderBy === "OverdueTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueTickets - b.OverdueTickets)
            } else if (orderBy === "ClosedTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedTicketsPercent)))
            } else if (orderBy === "ClosedTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedTicketsPercent)))
            } else if (orderBy === "OverdueTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverdueTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverdueTicketsPercent)))
            } else if (orderBy === "OverdueTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverdueTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverdueTicketsPercent)))
            } else if (orderBy === "OpenTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OpenTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OpenTicketsPercent)))
            } else if (orderBy === "OpenTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OpenTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OpenTicketsPercent)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.status(200).send({
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "GrandOpenPercentage": grandTotalOpenPercentage + "%",
                "Data": sortedResp
            });
        }
        console.log(respArray);
    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForTeamLeadWithAgents = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }

    try {

        let query = `select  departmentId, departmentName, teamName,fullName,
        sum(1) as totalinrow,
sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
        sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as zeroday,
        sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as oneday,
        sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as twoday,
        sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as threeday,
        sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fourday,
        sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fiveday,
        sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sixday,
        sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenday,
        sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenplusday,
concat(round(( sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
concat(round(( sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
concat(round(( sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
concat(round(( sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
concat(round(( sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
concat(round(( sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
concat(round(( sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
concat(round(( sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
concat(round(( sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage,

sum(case when diff_date_closed < 1 then 1 else 0 end ) as zeroday_closed,
		sum(case when diff_date_closed = 1 then 1 else 0 end ) as oneday_closed,
		sum(case when diff_date_closed = 2 then 1 else 0 end ) as twoday_closed,
		sum(case when diff_date_closed = 3 then 1 else 0 end ) as threeday_closed,
		sum(case when diff_date_closed = 4 then 1 else 0 end ) as fourday_closed,
		sum(case when diff_date_closed = 5 then 1 else 0 end ) as fiveday_closed,
		sum(case when diff_date_closed = 6 then 1 else 0 end ) as sixday_closed,
		sum(case when diff_date_closed = 7 then 1 else 0 end ) as sevenday_closed,
		sum(case when diff_date > 7 then 1 else 0 end ) as sevenplusday_closed,
        concat(round(( sum(case when diff_date_closed < 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 2 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 3 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 4 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 5 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 6 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage_closed,
        concat(round(( sum(case when diff_date_closed > 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage_closed
from
(
        select datediff(case when closedDate is null then now() else closedDate end, level1SlaDue) diff_date,datediff(case when closedDate is null then now() else closedDate end, initialCreatedDate) diff_date_closed, t.departmentId, d.departmentName, tm.teamName,t.closedDate,t.isTicketOverdue,u.fullName,t.ticketStatus
        From  tickets t, users u, departments  d, teamLead_agnt_dept_associations ass, teams tm
        where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and d.id = ass.departmentId and ass.teamId=tm.id and ass.agentId=t.assigneeId and t.assigneeId=u.id`
        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        query = query +
            ` and ass.teamLeadId=${userId}
	  ) tmp group by departmentId, departmentName, teamName,fullName`
        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'AgentName' || orderBy === 'AgentName') {
                query = query.concat(` order by u.fullName ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "SNo": counter,
                "AgentName": i.fullName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "OverdueAging": [{
                    "zeroday": i.zeroday,
                    "oneday": i.oneday,
                    "twoday": i.twoday,
                    "threeday": i.threeday,
                    "fourday": i.fourday,
                    "fiveday": i.fiveday,
                    "sixday": i.sixday,
                    "sevenday": i.sevenday,
                    "sevenplusday": i.sevenplusday,
                    "zeroday_percentage": i.zeroday_percentage,
                    "oneday_percentage": i.oneday_percentage,
                    "twoday_percentage": i.twoday_percentage,
                    "threeday_percentage": i.threeday_percentage,
                    "fourday_percentage": i.fourday_percentage,
                    "fiveday_percentage": i.fiveday_percentage,
                    "sixday_percentage": i.sixday_percentage,
                    "sevenday_percentage": i.sevenday_percentage,
                    "sevenplusday_percentage": i.sevenplusday_percentage
                }],
                "ClosedAging": [{
                    "zeroday": i.zeroday_closed,
                    "oneday": i.oneday_closed,
                    "twoday": i.twoday_closed,
                    "threeday": i.threeday_closed,
                    "fourday": i.fourday_closed,
                    "fiveday": i.fiveday_closed,
                    "sixday": i.sixday_closed,
                    "sevenday": i.sevenday_closed,
                    "sevenplusday": i.sevenplusday_closed,
                    "zeroday_percentage": i.zeroday_percentage_closed,
                    "oneday_percentage": i.oneday_percentage_closed,
                    "twoday_percentage": i.twoday_percentage_closed,
                    "threeday_percentage": i.threeday_percentage_closed,
                    "fourday_percentage": i.fourday_percentage_closed,
                    "fiveday_percentage": i.fiveday_percentage_closed,
                    "sixday_percentage": i.sixday_percentage_closed,
                    "sevenday_percentage": i.sevenday_percentage_closed,
                    "sevenplusday_percentage": i.sevenplusday_percentage_closed
                }]
            })
            counter++;
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.mergeCells('I1', 'Q1');
            worksheet.getCell('I1').value = 'Aging Analysis of Overdue tickets In Numbers'
            worksheet.mergeCells('R1', 'Z1');
            worksheet.getCell('R1').value = 'Aging Analysis of Overdue tickets in %'

            worksheet.mergeCells('AA1', 'AI1');
            worksheet.getCell('AA1').value = 'Aging Analysis of Closed tickets In Numbers'
            worksheet.mergeCells('AJ1', 'AR1');
            worksheet.getCell('AJ1').value = 'Aging Analysis of Closed tickets in %'

            /*Column headers*/
            worksheet.getRow(2).values = ['S.No', 'Agent', 'Total Tickets Assigned', 'Open', 'Closed', 'Overdue', '% Closed', '% Overdue', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days'];

            worksheet.getRow(2).font = { bold: true };
            worksheet.getRow(1).font = { bold: true };
            worksheet.columns = [
                { key: 'SNo' },
                { key: 'Agent' },
                { key: 'TotalAssignedTickets' },
                { key: 'Open' },
                { key: 'Closed' },
                { key: 'Overdue' },
                { key: 'ClosedPercent' },
                { key: 'OverduePercent' },
                { key: 'OverdueZeroDay' },
                { key: 'OverdueOneDay' },
                { key: 'OverdueTwoDay' },
                { key: 'OverdueThreeDay' },
                { key: 'OverdueFourDay' },
                { key: 'OverdueFiveDay' },
                { key: 'OverdueSixDay' },
                { key: 'OverdueSevenDay' },
                { key: 'OverdueGreaterSevenDay' },
                { key: 'OverdueZeroPercent' },
                { key: 'OverdueOnePercent' },
                { key: 'OverdueTwoPercent' },
                { key: 'OverdueThreePercent' },
                { key: 'OverdueFourPercent' },
                { key: 'OverdueFivePercent' },
                { key: 'OverdueSixPercent' },
                { key: 'OverdueSevenPercent' },
                { key: 'OverdueGreaterSevenPercent' },
                { key: 'ClosedZeroDay' },
                { key: 'ClosedOneDay' },
                { key: 'ClosedTwoDay' },
                { key: 'ClosedThreeDay' },
                { key: 'ClosedFourDay' },
                { key: 'ClosedFiveDay' },
                { key: 'ClosedSixDay' },
                { key: 'ClosedSevenDay' },
                { key: 'ClosedGreaterSevenDay' },
                { key: 'ClosedZeroPercent' },
                { key: 'ClosedOnePercent' },
                { key: 'ClosedTwoPercent' },
                { key: 'ClosedThreePercent' },
                { key: 'ClosedFourPercent' },
                { key: 'ClosedFivePercent' },
                { key: 'ClosedSixPercent' },
                { key: 'ClosedSevenPercent' },
                { key: 'ClosedGreaterSevenPercent' },
            ]


            //<Start--Overdue Row>    
            respArray.forEach(function (item, index) {
                worksheet.addRow({
                    'SNo': item.SNo,
                    'Agent': item.AgentName,
                    'TotalAssignedTickets': item.TotalAssignedTickets,
                    'Open': item.OpenCount,
                    'Closed': item.ClosedCount,
                    'Overdue': item.OverdueCount,
                    'ClosedPercent': item.ClosedPercentage,
                    'OverduePercent': item.OverduePercentage,
                    'OverdueZeroDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday),
                    'OverdueOneDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday),
                    'OverdueTwoDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday),
                    'OverdueThreeDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday),
                    'OverdueFourDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday),
                    'OverdueFiveDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday),
                    'OverdueSixDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday),
                    'OverdueSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday),
                    'OverdueGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday),
                    'OverdueZeroPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday_percentage),
                    'OverdueOnePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday_percentage),
                    'OverdueTwoPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday_percentage),
                    'OverdueThreePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday_percentage),
                    'OverdueFourPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday_percentage),
                    'OverdueFivePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday_percentage),
                    'OverdueSixPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday_percentage),
                    'OverdueSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday_percentage),
                    'OverdueGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday_percentage),

                    'ClosedZeroDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday),
                    'ClosedOneDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday),
                    'ClosedTwoDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday),
                    'ClosedThreeDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday),
                    'ClosedFourDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday),
                    'ClosedFiveDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday),
                    'ClosedSixDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday),
                    'ClosedSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday),
                    'ClosedGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday),
                    'ClosedZeroPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday_percentage),
                    'ClosedOnePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday_percentage),
                    'ClosedTwoPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday_percentage),
                    'ClosedThreePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday_percentage),
                    'ClosedFourPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday_percentage),
                    'ClosedFivePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday_percentage),
                    'ClosedSixPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday_percentage),
                    'ClosedSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday_percentage),
                    'ClosedGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday_percentage),
                })

            })

            //Add Total Count row in last
            worksheet.addRow({
                'SNo': ' ',
                'Agent': 'Total',
                'TotalAssignedTickets': grandTotalCount,
                'Open': grandTotalOpenCount,
                'Closed': grandTotalClosedCount,
                'Overdue': grandTotalOpenCount,
                'ClosedPercent': grandTotalClosedPercentage + '%',
                'OverduePercent': grandTotalOverduePercentage + '%',
            })
            //<End--Overdue Row>    



            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ticketsAnalysis.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "OverduePercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForTeamLeadWithAgentsSLA = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }

    try {

        let query = `SELECT 
        fullName,
        ROUND(AVG(sladue), 2) AS averageSLA,
        ROUND(AVG(diff_date), 2) AS completedDays,
        ROUND((AVG(sladue) - AVG(diff_date)), 2) AS differenceDays,
        SUM(1) AS totalinrow,
        SUM(CASE
            WHEN closedDate IS NOT NULL THEN 1
            ELSE 0
        END) AS closedTickets,
        SUM(CASE
            WHEN closedDate is null and isTicketOverdue is null THEN 1
            ELSE 0
        END) AS openTickets,
        SUM(CASE
            WHEN closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') THEN 1
            ELSE 0
        END) AS overdueTickets,
        CONCAT(ROUND((SUM(CASE
                            WHEN closedDate IS NOT NULL THEN 1
                            ELSE 0
                        END) / SUM(1) * 100),
                        2),
                '%') AS closedTicketPercent,
        CONCAT(ROUND((SUM(CASE
                            WHEN closedDate IS NULL THEN 1
                            ELSE 0
                        END) / SUM(1) * 100),
                        2),
                '%') AS openTicketPercent,
        CONCAT(ROUND((SUM(CASE
                            WHEN closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') THEN 1
                            ELSE 0
                        END) / SUM(1) * 100),
                        2),
                '%') AS overdueTicketPercent
    FROM
        (SELECT 
            TIMESTAMPDIFF(HOUR, initialCreatedDate, closedDate) / 24 AS diff_date,
                slaPlanInMinutes / (60 * 24) AS sladue,
                t.departmentId,
                t.ticketStatus,
                d.departmentName,
                tm.teamName,
                t.closedDate,
                t.isTicketOverdue,
                u.fullName
        FROM
            tickets t, users u, departments d, teamLead_agnt_dept_associations ass, teams tm
        WHERE
            t.createdAt BETWEEN '${createdStartDate}' and '${createdEndDate}'`

        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        query = query + ` AND t.departmentId = d.id
                AND d.id = ass.departmentId
                AND ass.teamId = tm.id
                AND ass.agentId = t.assigneeId
                AND t.assigneeId = u.id
                AND ass.teamLeadId = ${userId}
                ) tmp
    GROUP BY departmentId , departmentName , teamName , fullName`
        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'AgentName' || orderBy === 'AgentName') {
                query = query.concat(` order by u.fullName ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "SNo": counter,
                "AgentName": i.fullName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "AverageSLA": i.averageSLA,
                "CompletedDays": i.completedDays,
                "Difference": i.differenceDays
            })
            counter++
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            respArray.push({
                "SNo": " ",
                "AgentName": "Total",
                "OpenCount": grandTotalOpenCount,
                "ClosedCount": grandTotalClosedCount,
                "ClosedPercentage": grandTotalClosedPercentage,
                "OverdueCount": grandTotalOverdueCount,
                "OverduePercentage": grandTotalOverduePercentage,
                "TotalAssignedTickets": grandTotalCount,
                "AverageSLA": "-",
                "CompletedDays": "-",
                "Difference": "-"
            })
            worksheet.columns = [
                { header: "S.No", key: "SNo", width: 30 },
                { header: "Agent Name", key: "AgentName", width: 30 },
                { header: "Total Assigned Tickets", key: "TotalAssignedTickets", width: 30 },
                { header: "Open Count", key: "OpenCount", width: 30 },
                { header: "Closed Count", key: "ClosedCount", width: 30 },
                { header: "Overdue Count", key: "OverdueCount", width: 30 },
                { header: "Average SLA", key: "AverageSLA", width: 30 },
                { header: "Completed Days", key: "CompletedDays", width: 30 },
                { header: "Difference Days", key: "Difference", width: 30 },
            ];

            // Add Array Rows
            worksheet.addRows(respArray);


            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ticketsAnalysis.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "AverageSLA" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.AverageSLA - a.AverageSLA)
            } else if (orderBy === "AverageSLA" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.AverageSLA - b.AverageSLA)
            } else if (orderBy === "CompletedDays" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.CompletedDays - a.CompletedDays)
            } else if (orderBy === "CompletedDays" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.CompletedDays - b.CompletedDays)
            } else if (orderBy === "Difference" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.Difference - a.Difference)
            } else if (orderBy === "Difference" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.Difference - b.Difference)
            }
            else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }

}
exports.findAnalyticsForCentralAgentWithDepartment = async (req, res) => {
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }
    try {
        //  Find all nested details
        //  Means find team name of those agents who are also part of some other team.
        const nestedTeamMembers = [];
        let agentsInTeam = new Set();
        for (let i of teams) {
            const teamLeadAgentDeptAssociationsResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { teamId: i } });
            if (teamLeadAgentDeptAssociationsResp !== null && teamLeadAgentDeptAssociationsResp.length > 0) {
                for (let j of teamLeadAgentDeptAssociationsResp) {
                    agentsInTeam.add(j.teamLeadId);
                    agentsInTeam.add(j.agentId);
                    let Counter = 0;
                    do {
                        const myIterator = agentsInTeam.values();
                        const agentsArray = [];
                        for (const i of myIterator) {
                            agentsArray.push(i);
                        }
                        currentlead = agentsArray[Counter];
                        const nestedTeamMembersOfLeadResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { [Op.or]: [{ teamLeadId: currentlead }, { teamLeadId: currentlead }, { agentId: currentlead }, { agentId: currentlead }] } });
                        if (nestedTeamMembersOfLeadResp != null) {
                            for (let k of nestedTeamMembersOfLeadResp) {
                                agentsInTeam.add(k.dataValues.agentId);
                                agentsInTeam.add(k.dataValues.teamLeadId);
                            }
                        }
                        Counter++;
                    } while (Counter < agentsInTeam.size)
                }
            }
        }

        let agentsInTeamIterator = agentsInTeam.values();
        for (let id of agentsInTeamIterator) {
            nestedTeamMembers.push(id);
        }

        let query = `select  departmentId, departmentName,
		sum(1) as totalinrow,
        sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
        sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
        sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
        concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
        concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
        concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
		sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as zeroday,
		sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as oneday,
		sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as twoday,
		sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as threeday,
		sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fourday,
		sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fiveday,
		sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sixday,
		sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenday,
		sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenplusday,
        concat(round(( sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
        concat(round(( sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
        concat(round(( sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
        concat(round(( sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
        concat(round(( sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
        concat(round(( sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
        concat(round(( sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
        concat(round(( sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
        concat(round(( sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage
from 
	(
		select distinct t.id, datediff(case when closedDate is null then now() else closedDate end, level1SlaDue) diff_date, t.departmentId, d.departmentName, t.closedDate,t.isTicketOverdue,t.ticketStatus
		From  tickets t, departments  d
		where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id `

        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        // if (nestedTeams !== null) {
        //     query = query + ` and tm.id IN (${nestedTeams})`
        // }
        query = query +
            ` and t.assigneeId IN (${nestedTeamMembers})
	  ) tmp group by departmentId, departmentName`
        if (orderBy === "DepartmentName") {
            query = query.concat(` order by d.departmentName ${orderDirection}`);
        } else if (orderBy === "TeamName") {
            query = query.concat(` order by tm.teamName ${orderDirection}`);
        }
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });


        //Closed Tickets aging query
        let query1 = `select  departmentId, departmentName,
		sum(1) as totalinrow,
        sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
        sum(case when closedDate is null then 1 else 0 end ) as openTickets,
        sum(case when isTicketOverdue is not null then 1 else 0 end )as overdueTickets,
        concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
        concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
        concat(round(( sum(case when isTicketOverdue is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
		sum(case when diff_date < 1 then 1 else 0 end ) as zeroday,
		sum(case when diff_date = 1 then 1 else 0 end ) as oneday,
		sum(case when diff_date = 2 then 1 else 0 end ) as twoday,
		sum(case when diff_date = 3 then 1 else 0 end ) as threeday,
		sum(case when diff_date = 4 then 1 else 0 end ) as fourday,
		sum(case when diff_date = 5 then 1 else 0 end ) as fiveday,
		sum(case when diff_date = 6 then 1 else 0 end ) as sixday,
		sum(case when diff_date = 7 then 1 else 0 end ) as sevenday,
		sum(case when diff_date > 7 then 1 else 0 end ) as sevenplusday,
        concat(round(( sum(case when diff_date < 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
        concat(round(( sum(case when diff_date = 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
        concat(round(( sum(case when diff_date = 2 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
        concat(round(( sum(case when diff_date = 3 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
        concat(round(( sum(case when diff_date = 4 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
        concat(round(( sum(case when diff_date = 5 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
        concat(round(( sum(case when diff_date = 6 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
        concat(round(( sum(case when diff_date = 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
        concat(round(( sum(case when diff_date > 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage
from 
	(
		select distinct t.id, datediff(case when closedDate is null then now() else closedDate end, initialCreatedDate) diff_date, t.departmentId, d.departmentName,t.closedDate,t.isTicketOverdue
		From  tickets t, departments  d 
		where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and t.closedDate is not null`

        if (departmentId !== null) {
            query1 = query1 + ` and d.id IN (${departmentId})`
        }
        // if (nestedTeams !== null) {
        //     query1 = query1 + ` and tm.id IN (${nestedTeams})`
        // }
        query1 = query1 +
            ` and t.assigneeId IN (${nestedTeamMembers})
	  ) tmp group by departmentId, departmentName;`
        const queryResp1 = await db.sequelize.query(query1, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "SNo": counter,
                "DepartmentName": i.departmentName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "OverdueAging": [{
                    "zeroday": i.zeroday,
                    "oneday": i.oneday,
                    "twoday": i.twoday,
                    "threeday": i.threeday,
                    "fourday": i.fourday,
                    "fiveday": i.fiveday,
                    "sixday": i.sixday,
                    "sevenday": i.sevenday,
                    "sevenplusday": i.sevenplusday,
                    "zeroday_percentage": i.zeroday_percentage,
                    "oneday_percentage": i.oneday_percentage,
                    "twoday_percentage": i.twoday_percentage,
                    "threeday_percentage": i.threeday_percentage,
                    "fourday_percentage": i.fourday_percentage,
                    "fiveday_percentage": i.fiveday_percentage,
                    "sixday_percentage": i.sixday_percentage,
                    "sevenday_percentage": i.sevenday_percentage,
                    "sevenplusday_percentage": i.sevenplusday_percentage
                }],
                "ClosedAging": [
                    {
                        "zeroday": 0,
                        "oneday": 0,
                        "twoday": 0,
                        "threeday": 0,
                        "fourday": 0,
                        "fiveday": 0,
                        "sixday": 0,
                        "sevenday": 0,
                        "sevenplusday": 0,
                        "zeroday_percentage": "0.00%",
                        "oneday_percentage": "0.00%",
                        "twoday_percentage": "0.00%",
                        "threeday_percentage": "0.00%",
                        "fourday_percentage": "0.00%",
                        "fiveday_percentage": "0.00%",
                        "sixday_percentage": "0.00%",
                        "sevenday_percentage": "0.00%",
                        "sevenplusday_percentage": "0.00%"
                    }
                ]
            })
            counter++;
        }
        for (let j of queryResp1) {
            for (var k = 0; k < respArray.length; k++) {
                if (j.departmentName === respArray[k].DepartmentName) {
                    respArray[k].ClosedAging = [
                        {
                            "zeroday": j.zeroday,
                            "oneday": j.oneday,
                            "twoday": j.twoday,
                            "threeday": j.threeday,
                            "fourday": j.fourday,
                            "fiveday": j.fiveday,
                            "sixday": j.sixday,
                            "sevenday": j.sevenday,
                            "sevenplusday": j.sevenplusday,
                            "zeroday_percentage": j.zeroday_percentage,
                            "oneday_percentage": j.oneday_percentage,
                            "twoday_percentage": j.twoday_percentage,
                            "threeday_percentage": j.threeday_percentage,
                            "fourday_percentage": j.fourday_percentage,
                            "fiveday_percentage": j.fiveday_percentage,
                            "sixday_percentage": j.sixday_percentage,
                            "sevenday_percentage": j.sevenday_percentage,
                            "sevenplusday_percentage": j.sevenplusday_percentage
                        }
                    ]
                }
            }
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Service Desk Analytics");
            worksheet.mergeCells('I1', 'Q1');
            worksheet.getCell('I1').value = 'Aging Analysis of Overdue tickets In Numbers'
            worksheet.mergeCells('R1', 'Z1');
            worksheet.getCell('R1').value = 'Aging Analysis of Overdue tickets in %'

            worksheet.mergeCells('AA1', 'AI1');
            worksheet.getCell('AA1').value = 'Aging Analysis of Closed tickets In Numbers'
            worksheet.mergeCells('AJ1', 'AR1');
            worksheet.getCell('AJ1').value = 'Aging Analysis of Closed tickets in %'

            /*Column headers*/
            worksheet.getRow(2).values = ['S.No', 'Department', 'Total Tickets Assigned', 'Open', 'Closed', 'Overdue', '% Closed', '% Overdue', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days'];

            worksheet.getRow(2).font = { bold: true };
            worksheet.getRow(1).font = { bold: true };
            worksheet.columns = [
                { key: 'SNo' },
                { key: 'Department' },
                { key: 'TotalAssignedTickets' },
                { key: 'Open' },
                { key: 'Closed' },
                { key: 'Overdue' },
                { key: 'ClosedPercent' },
                { key: 'OverduePercent' },
                { key: 'OverdueZeroDay' },
                { key: 'OverdueOneDay' },
                { key: 'OverdueTwoDay' },
                { key: 'OverdueThreeDay' },
                { key: 'OverdueFourDay' },
                { key: 'OverdueFiveDay' },
                { key: 'OverdueSixDay' },
                { key: 'OverdueSevenDay' },
                { key: 'OverdueGreaterSevenDay' },
                { key: 'OverdueZeroPercent' },
                { key: 'OverdueOnePercent' },
                { key: 'OverdueTwoPercent' },
                { key: 'OverdueThreePercent' },
                { key: 'OverdueFourPercent' },
                { key: 'OverdueFivePercent' },
                { key: 'OverdueSixPercent' },
                { key: 'OverdueSevenPercent' },
                { key: 'OverdueGreaterSevenPercent' },
                { key: 'ClosedZeroDay' },
                { key: 'ClosedOneDay' },
                { key: 'ClosedTwoDay' },
                { key: 'ClosedThreeDay' },
                { key: 'ClosedFourDay' },
                { key: 'ClosedFiveDay' },
                { key: 'ClosedSixDay' },
                { key: 'ClosedSevenDay' },
                { key: 'ClosedGreaterSevenDay' },
                { key: 'ClosedZeroPercent' },
                { key: 'ClosedOnePercent' },
                { key: 'ClosedTwoPercent' },
                { key: 'ClosedThreePercent' },
                { key: 'ClosedFourPercent' },
                { key: 'ClosedFivePercent' },
                { key: 'ClosedSixPercent' },
                { key: 'ClosedSevenPercent' },
                { key: 'ClosedGreaterSevenPercent' },
            ]


            //<Start--Overdue Row>    
            respArray.forEach(function (item, index) {
                worksheet.addRow({
                    'SNo': item.SNo,
                    'Department': item.DepartmentName,
                    'TotalAssignedTickets': item.TotalAssignedTickets,
                    'Open': item.OpenCount,
                    'Closed': item.ClosedCount,
                    'Overdue': item.OverdueCount,
                    'ClosedPercent': item.ClosedPercentage,
                    'OverduePercent': item.OverduePercentage,
                    'OverdueZeroDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday),
                    'OverdueOneDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday),
                    'OverdueTwoDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday),
                    'OverdueThreeDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday),
                    'OverdueFourDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday),
                    'OverdueFiveDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday),
                    'OverdueSixDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday),
                    'OverdueSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday),
                    'OverdueGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday),
                    'OverdueZeroPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday_percentage),
                    'OverdueOnePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday_percentage),
                    'OverdueTwoPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday_percentage),
                    'OverdueThreePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday_percentage),
                    'OverdueFourPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday_percentage),
                    'OverdueFivePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday_percentage),
                    'OverdueSixPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday_percentage),
                    'OverdueSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday_percentage),
                    'OverdueGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday_percentage),

                    'ClosedZeroDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday),
                    'ClosedOneDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday),
                    'ClosedTwoDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday),
                    'ClosedThreeDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday),
                    'ClosedFourDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday),
                    'ClosedFiveDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday),
                    'ClosedSixDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday),
                    'ClosedSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday),
                    'ClosedGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday),
                    'ClosedZeroPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday_percentage),
                    'ClosedOnePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday_percentage),
                    'ClosedTwoPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday_percentage),
                    'ClosedThreePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday_percentage),
                    'ClosedFourPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday_percentage),
                    'ClosedFivePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday_percentage),
                    'ClosedSixPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday_percentage),
                    'ClosedSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday_percentage),
                    'ClosedGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday_percentage),
                })

            })

            //Add Total Count row in last
            worksheet.addRow({
                'SNo': ' ',
                'Department': 'Total',
                'TotalAssignedTickets': grandTotalCount,
                'Open': grandTotalOpenCount,
                'Closed': grandTotalClosedCount,
                'Overdue': grandTotalOpenCount,
                'ClosedPercent': grandTotalClosedPercentage + '%',
                'OverduePercent': grandTotalOverduePercentage + '%',
            })
            //<End--Overdue Row>    



            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "serviceDeskAnalytics.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "OverduePercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForCentralAgentWithHelptopic = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let helptopicId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.helptopicIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let isExport = req.query.isExport;
    let respArray = [];

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    helptopicId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(helptopicId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([]);
    }

    try {
        //  Find all nested details
        //  Means find team name of those agents who are also part of some other team.
        const nestedTeamMembers = [];
        let agentsInTeam = new Set();
        for (let i of teams) {
            const teamLeadAgentDeptAssociationsResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { teamId: i } });
            if (teamLeadAgentDeptAssociationsResp !== null && teamLeadAgentDeptAssociationsResp.length > 0) {
                for (let j of teamLeadAgentDeptAssociationsResp) {
                    agentsInTeam.add(j.teamLeadId);
                    agentsInTeam.add(j.agentId);
                    let Counter = 0;
                    do {
                        const myIterator = agentsInTeam.values();
                        const agentsArray = [];
                        for (const i of myIterator) {
                            agentsArray.push(i);
                        }
                        currentlead = agentsArray[Counter];
                        const nestedTeamMembersOfLeadResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { [Op.or]: [{ teamLeadId: currentlead }, { teamLeadId: currentlead }, { agentId: currentlead }, { agentId: currentlead }] } });
                        if (nestedTeamMembersOfLeadResp != null) {
                            for (let k of nestedTeamMembersOfLeadResp) {
                                agentsInTeam.add(k.dataValues.agentId);
                                agentsInTeam.add(k.dataValues.teamLeadId);
                            }
                        }
                        Counter++;
                    } while (Counter < agentsInTeam.size)
                }
            }
        }

        let agentsInTeamIterator = agentsInTeam.values();
        for (let id of agentsInTeamIterator) {
            nestedTeamMembers.push(id);
        }
        let query = `select helpTopicId,helpTopicName, departmentId, departmentName,
		sum(1) as totalTicketCount,
        sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
        sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
        sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
        concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
        concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
        concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent
from 
	(
		select distinct t.id,helpTopicId,h.helpTopicName, t.departmentId, d.departmentName,t.closedDate,t.isTicketOverdue,t.ticketStatus
		From  tickets t, departments  d, helptopics h
		where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id  and t.helpTopicId =h.id and h.departmentId=d.id`

        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        // if (nestedTeams !== null) {
        //     query = query + ` and tm.id IN (${nestedTeams})`
        // }
        if (helptopicId !== null) {
            query = query + ` and helpTopicId IN (${helptopicId})`
        }
        query = query +
            ` and t.assigneeId IN (${nestedTeamMembers})
	  ) tmp group by departmentId,helpTopicId, departmentName`
        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'DepartmentName' || orderBy === 'HelpTopicName') {
                query = query.concat(` order by d.departmentName ${orderDirection}`);
            } else if (orderBy === 'TeamName') {
                query = query.concat(` order by tm.teamName ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        let grandTotalCount = 0;
        let grandTotalOpenCount = 0;
        let grandTotalOpenPercentage = 0;
        let grandTotalClosedCount = 0;
        let grandTotalClosedPercentage = 0;
        let grandTotalOverdueCount = 0;
        let grandTotalOverduePercentage = 0;

        for (const i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalTicketCount);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalOpenPercentage = generalMethodsController.findPercentage(parseInt(grandTotalOpenCount), parseInt(grandTotalCount));
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "DepartmentName": i.departmentName,
                "HelpTopicName": i.helpTopicName,
                "TotalTickets": parseInt(i.totalTicketCount),
                "OpenTickets": parseInt(i.openTickets),
                "ClosedTickets": parseInt(i.closedTickets),
                "OverdueTickets": parseInt(i.overdueTickets),
                "ClosedTicketsPercent": i.closedTicketPercent,
                "OverdueTicketsPercent": i.overdueTicketPercent,
                "OpenTicketsPercent": i.openTicketPercent
            })


        }
        if (isExport === "true") {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Helpdesk Analytics");
            worksheet.columns = [
                { header: 'Department', key: 'DepartmentName' },
                { header: 'Helptopic', key: 'HelpTopicName' },
                { header: 'Total Tickets', key: 'TotalTickets' },
                { header: 'Open', key: 'OpenTickets' },
                { header: 'Closed', key: 'ClosedTickets' },
                { header: 'Overdue', key: 'ClosedTicketsPercent' },
                { header: '% Closed', key: 'closedPercent' },
                { header: '% Overdue', key: 'OverdueTicketsPercent' },
                { header: '% In Progress', key: 'OpenTicketsPercent' },
            ];
            worksheet.columns.forEach(column => {
                column.width = column.header.length < 12 ? 12 : column.header.length
            })
            worksheet.getRow(1).font = { bold: true };

            worksheet.addRows(respArray);

            //Add Total Count row in last
            worksheet.addRow({
                'DepartmentName': ' ',
                'HelpTopicName': 'Total',
                'TotalTickets': grandTotalCount,
                'OpenTickets': grandTotalOpenCount,
                'ClosedTickets': grandTotalClosedCount,
                'OverdueTickets': grandTotalOverdueCount,
                'ClosedTicketsPercent': grandTotalClosedPercentage + '%',
                'OverdueTicketsPercent': grandTotalOverduePercentage + '%',
                'OpenTicketsPercent': grandTotalOpenPercentage + '%',
            })
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ServiceDeskAnalytics.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "TotalTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalTickets - a.TotalTickets)
            } else if (orderBy === "TotalTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalTickets - b.TotalTickets)
            } else if (orderBy === "OpenTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenTickets - a.OpenTickets)
            } else if (orderBy === "OpenTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenTickets - b.OpenTickets)
            } else if (orderBy === "ClosedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedTickets - a.ClosedTickets)
            } else if (orderBy === "ClosedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedTickets - b.ClosedTickets)
            } else if (orderBy === "OverdueTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueTickets - a.OverdueTickets)
            } else if (orderBy === "OverdueTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueTickets - b.OverdueTickets)
            } else if (orderBy === "ClosedTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedTicketsPercent)))
            } else if (orderBy === "ClosedTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedTicketsPercent)))
            } else if (orderBy === "OverdueTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverdueTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverdueTicketsPercent)))
            } else if (orderBy === "OverdueTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverdueTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverdueTicketsPercent)))
            } else if (orderBy === "OpenTicketsPercent" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OpenTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OpenTicketsPercent)))
            } else if (orderBy === "OpenTicketsPercent" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OpenTicketsPercent)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OpenTicketsPercent)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.status(200).send({
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "GrandOpenPercentage": grandTotalOpenPercentage + "%",
                "Data": sortedResp
            });
        }
        console.log(respArray);
    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForCentralAgentWithAgents = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let agentsInTeam = generalMethodsController.convertCommaSeparatedStringToArray(req.query.agentsInTeam);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }

    try {

        let query = `select  departmentId, departmentName,fullName,
        sum(1) as totalinrow,
sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
        sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as zeroday,
        sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as oneday,
        sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as twoday,
        sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as threeday,
        sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fourday,
        sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fiveday,
        sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sixday,
        sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenday,
        sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenplusday,
concat(round(( sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
concat(round(( sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
concat(round(( sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
concat(round(( sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
concat(round(( sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
concat(round(( sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
concat(round(( sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
concat(round(( sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
concat(round(( sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage,

sum(case when diff_date_closed < 1 then 1 else 0 end ) as zeroday_closed,
		sum(case when diff_date_closed = 1 then 1 else 0 end ) as oneday_closed,
		sum(case when diff_date_closed = 2 then 1 else 0 end ) as twoday_closed,
		sum(case when diff_date_closed = 3 then 1 else 0 end ) as threeday_closed,
		sum(case when diff_date_closed = 4 then 1 else 0 end ) as fourday_closed,
		sum(case when diff_date_closed = 5 then 1 else 0 end ) as fiveday_closed,
		sum(case when diff_date_closed = 6 then 1 else 0 end ) as sixday_closed,
		sum(case when diff_date_closed = 7 then 1 else 0 end ) as sevenday_closed,
		sum(case when diff_date > 7 then 1 else 0 end ) as sevenplusday_closed,
        concat(round(( sum(case when diff_date_closed < 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 2 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 3 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 4 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 5 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 6 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage_closed,
        concat(round(( sum(case when diff_date_closed = 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage_closed,
        concat(round(( sum(case when diff_date_closed > 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage_closed
from
(
        select datediff(case when closedDate is null then now() else closedDate end, level1SlaDue) diff_date,datediff(case when closedDate is null then now() else closedDate end, initialCreatedDate) diff_date_closed, t.departmentId, d.departmentName, tm.teamName,t.closedDate,t.isTicketOverdue,u.fullName,t.ticketStatus
        From  tickets t, users u, departments  d, teamLead_agnt_dept_associations ass, teams tm
        where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and d.id = ass.departmentId and ass.teamId=tm.id and ass.agentId=t.assigneeId and t.assigneeId=u.id`
        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        if (agentsInTeam !== null && agentsInTeam.length > 0) {
            query = query + ` and ass.agentId IN (${agentsInTeam})`
        }
        query = query +
            `
	  ) tmp group by departmentId, departmentName,fullName`
        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'AgentName' || orderBy === 'AgentName') {
                query = query.concat(` order by u.fullName ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "SNo": counter,
                "AgentName": i.fullName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "OverdueAging": [{
                    "zeroday": i.zeroday,
                    "oneday": i.oneday,
                    "twoday": i.twoday,
                    "threeday": i.threeday,
                    "fourday": i.fourday,
                    "fiveday": i.fiveday,
                    "sixday": i.sixday,
                    "sevenday": i.sevenday,
                    "sevenplusday": i.sevenplusday,
                    "zeroday_percentage": i.zeroday_percentage,
                    "oneday_percentage": i.oneday_percentage,
                    "twoday_percentage": i.twoday_percentage,
                    "threeday_percentage": i.threeday_percentage,
                    "fourday_percentage": i.fourday_percentage,
                    "fiveday_percentage": i.fiveday_percentage,
                    "sixday_percentage": i.sixday_percentage,
                    "sevenday_percentage": i.sevenday_percentage,
                    "sevenplusday_percentage": i.sevenplusday_percentage
                }],
                "ClosedAging": [{
                    "zeroday": i.zeroday_closed,
                    "oneday": i.oneday_closed,
                    "twoday": i.twoday_closed,
                    "threeday": i.threeday_closed,
                    "fourday": i.fourday_closed,
                    "fiveday": i.fiveday_closed,
                    "sixday": i.sixday_closed,
                    "sevenday": i.sevenday_closed,
                    "sevenplusday": i.sevenplusday_closed,
                    "zeroday_percentage": i.zeroday_percentage_closed,
                    "oneday_percentage": i.oneday_percentage_closed,
                    "twoday_percentage": i.twoday_percentage_closed,
                    "threeday_percentage": i.threeday_percentage_closed,
                    "fourday_percentage": i.fourday_percentage_closed,
                    "fiveday_percentage": i.fiveday_percentage_closed,
                    "sixday_percentage": i.sixday_percentage_closed,
                    "sevenday_percentage": i.sevenday_percentage_closed,
                    "sevenplusday_percentage": i.sevenplusday_percentage_closed
                }]
            })
            counter++;
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.mergeCells('I1', 'Q1');
            worksheet.getCell('I1').value = 'Aging Analysis of Overdue tickets In Numbers'
            worksheet.mergeCells('R1', 'Z1');
            worksheet.getCell('R1').value = 'Aging Analysis of Overdue tickets in %'

            worksheet.mergeCells('AA1', 'AI1');
            worksheet.getCell('AA1').value = 'Aging Analysis of Closed tickets In Numbers'
            worksheet.mergeCells('AJ1', 'AR1');
            worksheet.getCell('AJ1').value = 'Aging Analysis of Closed tickets in %'

            /*Column headers*/
            worksheet.getRow(2).values = ['S.No', 'Agent', 'Total Tickets Assigned', 'Open', 'Closed', 'Overdue', '% Closed', '% Overdue', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days'];

            worksheet.getRow(2).font = { bold: true };
            worksheet.getRow(1).font = { bold: true };
            worksheet.columns = [
                { key: 'SNo' },
                { key: 'Agent' },
                { key: 'TotalAssignedTickets' },
                { key: 'Open' },
                { key: 'Closed' },
                { key: 'Overdue' },
                { key: 'ClosedPercent' },
                { key: 'OverduePercent' },
                { key: 'OverdueZeroDay' },
                { key: 'OverdueOneDay' },
                { key: 'OverdueTwoDay' },
                { key: 'OverdueThreeDay' },
                { key: 'OverdueFourDay' },
                { key: 'OverdueFiveDay' },
                { key: 'OverdueSixDay' },
                { key: 'OverdueSevenDay' },
                { key: 'OverdueGreaterSevenDay' },
                { key: 'OverdueZeroPercent' },
                { key: 'OverdueOnePercent' },
                { key: 'OverdueTwoPercent' },
                { key: 'OverdueThreePercent' },
                { key: 'OverdueFourPercent' },
                { key: 'OverdueFivePercent' },
                { key: 'OverdueSixPercent' },
                { key: 'OverdueSevenPercent' },
                { key: 'OverdueGreaterSevenPercent' },
                { key: 'ClosedZeroDay' },
                { key: 'ClosedOneDay' },
                { key: 'ClosedTwoDay' },
                { key: 'ClosedThreeDay' },
                { key: 'ClosedFourDay' },
                { key: 'ClosedFiveDay' },
                { key: 'ClosedSixDay' },
                { key: 'ClosedSevenDay' },
                { key: 'ClosedGreaterSevenDay' },
                { key: 'ClosedZeroPercent' },
                { key: 'ClosedOnePercent' },
                { key: 'ClosedTwoPercent' },
                { key: 'ClosedThreePercent' },
                { key: 'ClosedFourPercent' },
                { key: 'ClosedFivePercent' },
                { key: 'ClosedSixPercent' },
                { key: 'ClosedSevenPercent' },
                { key: 'ClosedGreaterSevenPercent' },
            ]


            //<Start--Overdue Row>    
            respArray.forEach(function (item, index) {
                worksheet.addRow({
                    'SNo': item.SNo,
                    'Agent': item.AgentName,
                    'TotalAssignedTickets': item.TotalAssignedTickets,
                    'Open': item.OpenCount,
                    'Closed': item.ClosedCount,
                    'Overdue': item.OverdueCount,
                    'ClosedPercent': item.ClosedPercentage,
                    'OverduePercent': item.OverduePercentage,
                    'OverdueZeroDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday),
                    'OverdueOneDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday),
                    'OverdueTwoDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday),
                    'OverdueThreeDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday),
                    'OverdueFourDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday),
                    'OverdueFiveDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday),
                    'OverdueSixDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday),
                    'OverdueSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday),
                    'OverdueGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday),
                    'OverdueZeroPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday_percentage),
                    'OverdueOnePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday_percentage),
                    'OverdueTwoPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday_percentage),
                    'OverdueThreePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday_percentage),
                    'OverdueFourPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday_percentage),
                    'OverdueFivePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday_percentage),
                    'OverdueSixPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday_percentage),
                    'OverdueSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday_percentage),
                    'OverdueGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday_percentage),

                    'ClosedZeroDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday),
                    'ClosedOneDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday),
                    'ClosedTwoDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday),
                    'ClosedThreeDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday),
                    'ClosedFourDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday),
                    'ClosedFiveDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday),
                    'ClosedSixDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday),
                    'ClosedSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday),
                    'ClosedGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday),
                    'ClosedZeroPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday_percentage),
                    'ClosedOnePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday_percentage),
                    'ClosedTwoPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday_percentage),
                    'ClosedThreePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday_percentage),
                    'ClosedFourPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday_percentage),
                    'ClosedFivePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday_percentage),
                    'ClosedSixPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday_percentage),
                    'ClosedSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday_percentage),
                    'ClosedGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday_percentage),
                })

            })

            //Add Total Count row in last
            worksheet.addRow({
                'SNo': ' ',
                'Agent': 'Total',
                'TotalAssignedTickets': grandTotalCount,
                'Open': grandTotalOpenCount,
                'Closed': grandTotalClosedCount,
                'Overdue': grandTotalOpenCount,
                'ClosedPercent': grandTotalClosedPercentage + '%',
                'OverduePercent': grandTotalOverduePercentage + '%',
            })
            //<End--Overdue Row>    



            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ticketsAnalysis.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "OverduePercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForCentralAgentWithAgentsSLA = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let agentsInTeam = generalMethodsController.convertCommaSeparatedStringToArray(req.query.agentsInTeam);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }

    try {

        let query = `SELECT 
        fullName,
        ROUND(AVG(sladue), 2) AS averageSLA,
        ROUND(AVG(diff_date), 2) AS completedDays,
        ROUND((AVG(sladue) - AVG(diff_date)), 2) AS differenceDays,
        SUM(1) AS totalinrow,
        SUM(CASE
            WHEN closedDate IS NOT NULL THEN 1
            ELSE 0
        END) AS closedTickets,
        SUM(CASE
            WHEN closedDate is null and isTicketOverdue is null THEN 1
            ELSE 0
        END) AS openTickets,
        SUM(CASE
            WHEN closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') THEN 1
            ELSE 0
        END) AS overdueTickets,
        CONCAT(ROUND((SUM(CASE
                            WHEN closedDate IS NOT NULL THEN 1
                            ELSE 0
                        END) / SUM(1) * 100),
                        2),
                '%') AS closedTicketPercent,
        CONCAT(ROUND((SUM(CASE
                            WHEN closedDate IS NULL THEN 1
                            ELSE 0
                        END) / SUM(1) * 100),
                        2),
                '%') AS openTicketPercent,
        CONCAT(ROUND((SUM(CASE
                            WHEN closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') THEN 1
                            ELSE 0
                        END) / SUM(1) * 100),
                        2),
                '%') AS overdueTicketPercent
    FROM
        (SELECT 
            TIMESTAMPDIFF(HOUR, initialCreatedDate, closedDate) / 24 AS diff_date,
                slaPlanInMinutes / (60 * 24) AS sladue,
                t.departmentId,
                d.departmentName,
                tm.teamName,
                t.closedDate,
                t.isTicketOverdue,
                u.fullName,
                t.ticketStatus
        FROM
            tickets t, users u, departments d, teamLead_agnt_dept_associations ass, teams tm
        WHERE
            t.createdAt BETWEEN '${createdStartDate}' and '${createdEndDate}'`

        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        if (agentsInTeam !== null && agentsInTeam.length > 0) {
            query = query + ` and ass.agentId IN (${agentsInTeam})`
        }
        query = query + ` AND t.departmentId = d.id
                AND d.id = ass.departmentId
                AND ass.teamId = tm.id
                AND ass.agentId = t.assigneeId
                AND t.assigneeId = u.id
                ) tmp
    GROUP BY departmentId , departmentName , fullName`
        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'AgentName' || orderBy === 'AgentName') {
                query = query.concat(` order by u.fullName ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });
        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            respArray.push({
                "SNo": counter,
                "AgentName": i.fullName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "AverageSLA": i.averageSLA,
                "CompletedDays": i.completedDays,
                "Difference": i.differenceDays
            })
            counter++
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            respArray.push({
                "SNo": " ",
                "AgentName": "Total",
                "OpenCount": grandTotalOpenCount,
                "ClosedCount": grandTotalClosedCount,
                "ClosedPercentage": grandTotalClosedPercentage,
                "OverdueCount": grandTotalOverdueCount,
                "OverduePercentage": grandTotalOverduePercentage,
                "TotalAssignedTickets": grandTotalCount,
                "AverageSLA": "-",
                "CompletedDays": "-",
                "Difference": "-"
            })
            worksheet.columns = [
                { header: "S.No", key: "SNo", width: 30 },
                { header: "Agent Name", key: "AgentName", width: 30 },
                { header: "Total Assigned Tickets", key: "TotalAssignedTickets", width: 30 },
                { header: "Open Count", key: "OpenCount", width: 30 },
                { header: "Closed Count", key: "ClosedCount", width: 30 },
                { header: "Overdue Count", key: "OverdueCount", width: 30 },
                { header: "Average SLA", key: "AverageSLA", width: 30 },
                { header: "Completed Days", key: "CompletedDays", width: 30 },
                { header: "Difference Days", key: "Difference", width: 30 },
            ];

            // Add Array Rows
            worksheet.addRows(respArray);


            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ticketsAnalysis.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "AverageSLA" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.AverageSLA - a.AverageSLA)
            } else if (orderBy === "AverageSLA" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.AverageSLA - b.AverageSLA)
            } else if (orderBy === "CompletedDays" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.CompletedDays - a.CompletedDays)
            } else if (orderBy === "CompletedDays" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.CompletedDays - b.CompletedDays)
            } else if (orderBy === "Difference" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.Difference - a.Difference)
            } else if (orderBy === "Difference" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.Difference - b.Difference)
            }
            else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }

}

exports.findAnalyticsForTeamLead = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let teamLeads = generalMethodsController.convertCommaSeparatedStringToArray(req.query.leadIds);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    teamLeads = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teamLeads);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }

    try {
        //  Find all nested details
        //  Means find team name of those agents who are also part of some other team.
        const nestedTeamMembers = [];
        let agentsInTeam = new Set();
        for (let i of teams) {
            const teamLeadAgentDeptAssociationsResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { teamId: i } });
            if (teamLeadAgentDeptAssociationsResp !== null && teamLeadAgentDeptAssociationsResp.length > 0) {
                for (let j of teamLeadAgentDeptAssociationsResp) {
                    agentsInTeam.add(j.teamLeadId);
                    agentsInTeam.add(j.agentId);
                    let Counter = 0;
                    do {
                        const myIterator = agentsInTeam.values();
                        const agentsArray = [];
                        for (const i of myIterator) {
                            agentsArray.push(i);
                        }
                        currentlead = agentsArray[Counter];
                        const nestedTeamMembersOfLeadResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { [Op.or]: [{ teamLeadId: currentlead }, { teamLeadId: currentlead }, { agentId: currentlead }, { agentId: currentlead }] } });
                        if (nestedTeamMembersOfLeadResp != null) {
                            for (let k of nestedTeamMembersOfLeadResp) {
                                agentsInTeam.add(k.dataValues.agentId);
                                agentsInTeam.add(k.dataValues.teamLeadId);
                            }
                        }
                        Counter++;
                    } while (Counter < agentsInTeam.size)
                }
            }
        }

        let agentsInTeamIterator = agentsInTeam.values();
        for (let id of agentsInTeamIterator) {
            nestedTeamMembers.push(id);
        }

        let query = `select  departmentId, departmentName, teamName,teamLeadId,
            sum(1) as totalinrow,
    sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
    sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
    sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
    concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
    concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
    concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
            sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as zeroday,
            sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as oneday,
            sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as twoday,
            sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as threeday,
            sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fourday,
            sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fiveday,
            sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sixday,
            sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenday,
            sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenplusday,
    concat(round(( sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
    concat(round(( sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
    concat(round(( sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
    concat(round(( sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
    concat(round(( sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
    concat(round(( sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
    concat(round(( sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
    concat(round(( sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
    concat(round(( sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage,
    
    sum(case when diff_date_closed < 1 then 1 else 0 end ) as zeroday_closed,
            sum(case when diff_date_closed = 1 then 1 else 0 end ) as oneday_closed,
            sum(case when diff_date_closed = 2 then 1 else 0 end ) as twoday_closed,
            sum(case when diff_date_closed = 3 then 1 else 0 end ) as threeday_closed,
            sum(case when diff_date_closed = 4 then 1 else 0 end ) as fourday_closed,
            sum(case when diff_date_closed = 5 then 1 else 0 end ) as fiveday_closed,
            sum(case when diff_date_closed = 6 then 1 else 0 end ) as sixday_closed,
            sum(case when diff_date_closed = 7 then 1 else 0 end ) as sevenday_closed,
            sum(case when diff_date > 7 then 1 else 0 end ) as sevenplusday_closed,
            concat(round(( sum(case when diff_date_closed < 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 2 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 3 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 4 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 5 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 6 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage_closed,
            concat(round(( sum(case when diff_date_closed > 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage_closed
    from
    (
            select distinct(t.id), datediff(case when closedDate is null then now() else closedDate end, level1SlaDue) diff_date,datediff(case when closedDate is null then now() else closedDate end, initialCreatedDate) diff_date_closed, t.departmentId, d.departmentName, tm.teamName,t.closedDate,t.isTicketOverdue,t.ticketStatus,ass.teamLeadId
            From  tickets t, users u, departments  d, teamLead_agnt_dept_associations ass, teams tm
            where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and d.id = ass.departmentId and ass.teamId=tm.id  and (ass.agentId = t.assigneeId or ass.teamLeadId = t.assigneeId)  and t.assigneeId=u.id`
        
            if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        if (teamLeads !== null) {
            query = query + ` and ass.teamLeadId IN (${teamLeads})`
        }
        // if( nestedTeamMembers!==null){
        //     query=query+ ` and t.assigneeId IN (${nestedTeamMembers})`
        // }
        query = query +
                ` and ass.teamLeadId=${userId}
          ) tmp group by departmentId, departmentName, teamName`
        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'AgentName' || orderBy === 'AgentName') {
                query = query.concat(` order by ass.teamLeadId ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            const userResp= await User.findOne({where:{id: i.teamLeadId}});
            let name
            if(userResp!==null){
                name= userResp.fullName;
            }

            respArray.push({
                "SNo": counter,
                "AgentName": name,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "OverdueAging": [{
                    "zeroday": i.zeroday,
                    "oneday": i.oneday,
                    "twoday": i.twoday,
                    "threeday": i.threeday,
                    "fourday": i.fourday,
                    "fiveday": i.fiveday,
                    "sixday": i.sixday,
                    "sevenday": i.sevenday,
                    "sevenplusday": i.sevenplusday,
                    "zeroday_percentage": i.zeroday_percentage,
                    "oneday_percentage": i.oneday_percentage,
                    "twoday_percentage": i.twoday_percentage,
                    "threeday_percentage": i.threeday_percentage,
                    "fourday_percentage": i.fourday_percentage,
                    "fiveday_percentage": i.fiveday_percentage,
                    "sixday_percentage": i.sixday_percentage,
                    "sevenday_percentage": i.sevenday_percentage,
                    "sevenplusday_percentage": i.sevenplusday_percentage
                }],
                "ClosedAging": [{
                    "zeroday": i.zeroday_closed,
                    "oneday": i.oneday_closed,
                    "twoday": i.twoday_closed,
                    "threeday": i.threeday_closed,
                    "fourday": i.fourday_closed,
                    "fiveday": i.fiveday_closed,
                    "sixday": i.sixday_closed,
                    "sevenday": i.sevenday_closed,
                    "sevenplusday": i.sevenplusday_closed,
                    "zeroday_percentage": i.zeroday_percentage_closed,
                    "oneday_percentage": i.oneday_percentage_closed,
                    "twoday_percentage": i.twoday_percentage_closed,
                    "threeday_percentage": i.threeday_percentage_closed,
                    "fourday_percentage": i.fourday_percentage_closed,
                    "fiveday_percentage": i.fiveday_percentage_closed,
                    "sixday_percentage": i.sixday_percentage_closed,
                    "sevenday_percentage": i.sevenday_percentage_closed,
                    "sevenplusday_percentage": i.sevenplusday_percentage_closed
                }]
            })
            counter++;
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.mergeCells('I1', 'Q1');
            worksheet.getCell('I1').value = 'Aging Analysis of Overdue tickets In Numbers'
            worksheet.mergeCells('R1', 'Z1');
            worksheet.getCell('R1').value = 'Aging Analysis of Overdue tickets in %'

            worksheet.mergeCells('AA1', 'AI1');
            worksheet.getCell('AA1').value = 'Aging Analysis of Closed tickets In Numbers'
            worksheet.mergeCells('AJ1', 'AR1');
            worksheet.getCell('AJ1').value = 'Aging Analysis of Closed tickets in %'

            /*Column headers*/
            worksheet.getRow(2).values = ['S.No', 'LeadName', 'Total Tickets Assigned', 'Open', 'Closed', 'Overdue', '% Closed', '% Overdue', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days'];

            worksheet.getRow(2).font = { bold: true };
            worksheet.getRow(1).font = { bold: true };
            worksheet.columns = [
                { key: 'SNo' },
                { key: 'Agent Name' },
                { key: 'TotalAssignedTickets' },
                { key: 'Open' },
                { key: 'Closed' },
                { key: 'Overdue' },
                { key: 'ClosedPercent' },
                { key: 'OverduePercent' },
                { key: 'OverdueZeroDay' },
                { key: 'OverdueOneDay' },
                { key: 'OverdueTwoDay' },
                { key: 'OverdueThreeDay' },
                { key: 'OverdueFourDay' },
                { key: 'OverdueFiveDay' },
                { key: 'OverdueSixDay' },
                { key: 'OverdueSevenDay' },
                { key: 'OverdueGreaterSevenDay' },
                { key: 'OverdueZeroPercent' },
                { key: 'OverdueOnePercent' },
                { key: 'OverdueTwoPercent' },
                { key: 'OverdueThreePercent' },
                { key: 'OverdueFourPercent' },
                { key: 'OverdueFivePercent' },
                { key: 'OverdueSixPercent' },
                { key: 'OverdueSevenPercent' },
                { key: 'OverdueGreaterSevenPercent' },
                { key: 'ClosedZeroDay' },
                { key: 'ClosedOneDay' },
                { key: 'ClosedTwoDay' },
                { key: 'ClosedThreeDay' },
                { key: 'ClosedFourDay' },
                { key: 'ClosedFiveDay' },
                { key: 'ClosedSixDay' },
                { key: 'ClosedSevenDay' },
                { key: 'ClosedGreaterSevenDay' },
                { key: 'ClosedZeroPercent' },
                { key: 'ClosedOnePercent' },
                { key: 'ClosedTwoPercent' },
                { key: 'ClosedThreePercent' },
                { key: 'ClosedFourPercent' },
                { key: 'ClosedFivePercent' },
                { key: 'ClosedSixPercent' },
                { key: 'ClosedSevenPercent' },
                { key: 'ClosedGreaterSevenPercent' },
            ]


            //<Start--Overdue Row>    
            respArray.forEach(function (item, index) {
                worksheet.addRow({
                    'SNo': item.SNo,
                    'Agent Name': item.AgentName,
                    'TotalAssignedTickets': item.TotalAssignedTickets,
                    'Open': item.OpenCount,
                    'Closed': item.ClosedCount,
                    'Overdue': item.OverdueCount,
                    'ClosedPercent': item.ClosedPercentage,
                    'OverduePercent': item.OverduePercentage,
                    'OverdueZeroDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday),
                    'OverdueOneDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday),
                    'OverdueTwoDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday),
                    'OverdueThreeDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday),
                    'OverdueFourDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday),
                    'OverdueFiveDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday),
                    'OverdueSixDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday),
                    'OverdueSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday),
                    'OverdueGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday),
                    'OverdueZeroPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday_percentage),
                    'OverdueOnePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday_percentage),
                    'OverdueTwoPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday_percentage),
                    'OverdueThreePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday_percentage),
                    'OverdueFourPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday_percentage),
                    'OverdueFivePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday_percentage),
                    'OverdueSixPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday_percentage),
                    'OverdueSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday_percentage),
                    'OverdueGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday_percentage),

                    'ClosedZeroDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday),
                    'ClosedOneDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday),
                    'ClosedTwoDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday),
                    'ClosedThreeDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday),
                    'ClosedFourDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday),
                    'ClosedFiveDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday),
                    'ClosedSixDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday),
                    'ClosedSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday),
                    'ClosedGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday),
                    'ClosedZeroPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday_percentage),
                    'ClosedOnePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday_percentage),
                    'ClosedTwoPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday_percentage),
                    'ClosedThreePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday_percentage),
                    'ClosedFourPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday_percentage),
                    'ClosedFivePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday_percentage),
                    'ClosedSixPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday_percentage),
                    'ClosedSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday_percentage),
                    'ClosedGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday_percentage),
                })

            })

            //Add Total Count row in last
            worksheet.addRow({
                'SNo': ' ',
                'LeadName': 'Total',
                'TotalAssignedTickets': grandTotalCount,
                'Open': grandTotalOpenCount,
                'Closed': grandTotalClosedCount,
                'Overdue': grandTotalOpenCount,
                'ClosedPercent': grandTotalClosedPercentage + '%',
                'OverduePercent': grandTotalOverduePercentage + '%',
            })
            //<End--Overdue Row>    



            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ticketsAnalysis.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "OverduePercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}

exports.findAnalyticsForCentralAgentTeamLeadView = async (req, res) => {
    const userId = req.query.userId;
    let createdStartDate = req.query.startDate;
    let createdEndDate = req.query.endDate;
    let departmentId = generalMethodsController.convertCommaSeparatedStringToArray(req.query.departmentIds);
    let teams = generalMethodsController.convertCommaSeparatedStringToArray(req.query.teams);
    let teamLeads = generalMethodsController.convertCommaSeparatedStringToArray(req.query.leadIds);
    let isExport = req.query.isExport;
    let respArray = [];
    let orderBy = req.query.orderBy;
    let orderDirection = req.query.orderDirection;

    let grandTotalCount = 0;
    let grandTotalOpenCount = 0;
    let grandTotalClosedCount = 0;
    let grandTotalClosedPercentage = 0;
    let grandTotalOverdueCount = 0;
    let grandTotalOverduePercentage = 0;

    departmentId = generalMethodsController.do_Null_Undefined_EmptyArray_Check(departmentId);
    teams = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teams);
    teamLeads = generalMethodsController.do_Null_Undefined_EmptyArray_Check(teamLeads);
    if (teams === null) {
        return res.send([{
            "GrandTotal": grandTotalCount,
            "GrandOpenTotal": grandTotalOpenCount,
            "GrandClosedCount": grandTotalClosedCount,
            "GrandClosedPercentage": grandTotalClosedPercentage + "%",
            "GrandOverdueCount": grandTotalOverdueCount,
            "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
            "Data": respArray
        }]);
    }

    try {
        //  Find all nested details
        //  Means find team name of those agents who are also part of some other team.
        const nestedTeamMembers = [];
        let agentsInTeam = new Set();
        for (let i of teams) {
            const teamLeadAgentDeptAssociationsResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { teamId: i } });
            if (teamLeadAgentDeptAssociationsResp !== null && teamLeadAgentDeptAssociationsResp.length > 0) {
                for (let j of teamLeadAgentDeptAssociationsResp) {
                    agentsInTeam.add(j.teamLeadId);
                    agentsInTeam.add(j.agentId);
                    let Counter = 0;
                    do {
                        const myIterator = agentsInTeam.values();
                        const agentsArray = [];
                        for (const i of myIterator) {
                            agentsArray.push(i);
                        }
                        currentlead = agentsArray[Counter];
                        const nestedTeamMembersOfLeadResp = await TeamLeadAgentDepartmentAssociation.findAll({ where: { [Op.or]: [{ teamLeadId: currentlead }, { teamLeadId: currentlead }, { agentId: currentlead }, { agentId: currentlead }] } });
                        if (nestedTeamMembersOfLeadResp != null) {
                            for (let k of nestedTeamMembersOfLeadResp) {
                                agentsInTeam.add(k.dataValues.agentId);
                                agentsInTeam.add(k.dataValues.teamLeadId);
                            }
                        }
                        Counter++;
                    } while (Counter < agentsInTeam.size)
                }
            }
        }

        let agentsInTeamIterator = agentsInTeam.values();
        for (let id of agentsInTeamIterator) {
            nestedTeamMembers.push(id);
        }

        let query = `select  departmentId, departmentName, teamName,teamLeadId,
            sum(1) as totalinrow,
    sum(case when closedDate is not null then 1 else 0 end ) as closedTickets ,
    sum(case when closedDate is null and isTicketOverdue is null then 1 else 0 end ) as openTickets,
    sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )as overdueTickets,
    concat(round(( sum(case when closedDate is not null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS closedTicketPercent,
    concat(round(( sum(case when closedDate is null then 1 else 0 end )/sum(1) * 100 ),2),'%') AS openTicketPercent,
    concat(round(( sum(case when closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS overdueTicketPercent,
            sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as zeroday,
            sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as oneday,
            sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as twoday,
            sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as threeday,
            sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fourday,
            sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as fiveday,
            sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sixday,
            sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenday,
            sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end ) as sevenplusday,
    concat(round(( sum(case when diff_date <=0 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage,
    concat(round(( sum(case when diff_date = 1 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage,
    concat(round(( sum(case when diff_date = 2 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage,
    concat(round(( sum(case when diff_date = 3 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage,
    concat(round(( sum(case when diff_date = 4 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage,
    concat(round(( sum(case when diff_date = 5 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage,
    concat(round(( sum(case when diff_date = 6 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage,
    concat(round(( sum(case when diff_date = 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage,
    concat(round(( sum(case when diff_date > 7 and closedDate is null and isTicketOverdue is not null and ticketStatus not in('Closed','Resolved') then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage,
    
    sum(case when diff_date_closed < 1 then 1 else 0 end ) as zeroday_closed,
            sum(case when diff_date_closed = 1 then 1 else 0 end ) as oneday_closed,
            sum(case when diff_date_closed = 2 then 1 else 0 end ) as twoday_closed,
            sum(case when diff_date_closed = 3 then 1 else 0 end ) as threeday_closed,
            sum(case when diff_date_closed = 4 then 1 else 0 end ) as fourday_closed,
            sum(case when diff_date_closed = 5 then 1 else 0 end ) as fiveday_closed,
            sum(case when diff_date_closed = 6 then 1 else 0 end ) as sixday_closed,
            sum(case when diff_date_closed = 7 then 1 else 0 end ) as sevenday_closed,
            sum(case when diff_date > 7 then 1 else 0 end ) as sevenplusday_closed,
            concat(round(( sum(case when diff_date_closed < 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS zeroday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 1 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS oneday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 2 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS twoday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 3 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS threeday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 4 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fourday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 5 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS fiveday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 6 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sixday_percentage_closed,
            concat(round(( sum(case when diff_date_closed = 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenday_percentage_closed,
            concat(round(( sum(case when diff_date_closed > 7 then 1 else 0 end )/sum(1) * 100 ),2),'%') AS sevenplusday_percentage_closed
    from
    (
        select distinct(t.id), datediff(case when closedDate is null then now() else closedDate end, level1SlaDue) diff_date,datediff(case when closedDate is null then now() else closedDate end, initialCreatedDate) diff_date_closed, t.departmentId, d.departmentName, tm.teamName,t.closedDate,t.isTicketOverdue,t.ticketStatus,ass.teamLeadId
            From  tickets t, users u, departments  d, teamLead_agnt_dept_associations ass, teams tm
            where t.createdAt between '${createdStartDate}' and '${createdEndDate}' and t.departmentId = d.id and d.id = ass.departmentId and ass.teamId=tm.id  and t.assigneeId=u.id`
        if (departmentId !== null) {
            query = query + ` and d.id IN (${departmentId})`
        }
        if (teams !== null) {
            query = query + ` and tm.id IN (${teams})`
        }
        if (teamLeads !== null) {
            query = query + ` and ass.teamLeadId IN (${teamLeads})`
        }
        if (nestedTeamMembers !== null) {
            query = query + ` and t.assigneeId IN (${nestedTeamMembers})`
        }
        query = query +
                `
          ) tmp group by departmentId, departmentName, teamName, teamLeadId`

        //Start--OrdeBy Clause
        if (orderBy !== undefined && orderBy !== "undefined") {
            if (orderBy === 'AgentName' || orderBy === 'AgentName') {
                query = query.concat(` order by ass.teamLeadId ${orderDirection}`);
            }
        }
        //End--OrdeBy Clause
        const queryResp = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        counter = 1;
        for (let i of queryResp) {
            grandTotalCount = parseInt(grandTotalCount) + parseInt(i.totalinrow);
            grandTotalOpenCount = parseInt(grandTotalOpenCount) + parseInt(i.openTickets);
            grandTotalClosedCount = parseInt(grandTotalClosedCount) + parseInt(i.closedTickets);
            grandTotalClosedPercentage = generalMethodsController.findPercentage(parseInt(grandTotalClosedCount), parseInt(grandTotalCount));
            grandTotalOverdueCount = parseInt(grandTotalOverdueCount) + parseInt(i.overdueTickets);
            grandTotalOverduePercentage = generalMethodsController.findPercentage(parseInt(grandTotalOverdueCount), parseInt(grandTotalCount));
            const userResp = await User.findOne({ where: { id: i.teamLeadId } });
            let name
            if (userResp !== null) {
                name = userResp.fullName;
            }

            respArray.push({
                "SNo": counter,
                "AgentName": name,
                "DepartmentName": i.departmentName,
                "OpenCount": i.openTickets,
                "ClosedCount": i.closedTickets,
                "ClosedPercentage": i.closedTicketPercent,
                "OverdueCount": i.overdueTickets,
                "OverduePercentage": i.overdueTicketPercent,
                "TotalAssignedTickets": i.totalinrow,
                "OverdueAging": [{
                    "zeroday": i.zeroday,
                    "oneday": i.oneday,
                    "twoday": i.twoday,
                    "threeday": i.threeday,
                    "fourday": i.fourday,
                    "fiveday": i.fiveday,
                    "sixday": i.sixday,
                    "sevenday": i.sevenday,
                    "sevenplusday": i.sevenplusday,
                    "zeroday_percentage": i.zeroday_percentage,
                    "oneday_percentage": i.oneday_percentage,
                    "twoday_percentage": i.twoday_percentage,
                    "threeday_percentage": i.threeday_percentage,
                    "fourday_percentage": i.fourday_percentage,
                    "fiveday_percentage": i.fiveday_percentage,
                    "sixday_percentage": i.sixday_percentage,
                    "sevenday_percentage": i.sevenday_percentage,
                    "sevenplusday_percentage": i.sevenplusday_percentage
                }],
                "ClosedAging": [{
                    "zeroday": i.zeroday_closed,
                    "oneday": i.oneday_closed,
                    "twoday": i.twoday_closed,
                    "threeday": i.threeday_closed,
                    "fourday": i.fourday_closed,
                    "fiveday": i.fiveday_closed,
                    "sixday": i.sixday_closed,
                    "sevenday": i.sevenday_closed,
                    "sevenplusday": i.sevenplusday_closed,
                    "zeroday_percentage": i.zeroday_percentage_closed,
                    "oneday_percentage": i.oneday_percentage_closed,
                    "twoday_percentage": i.twoday_percentage_closed,
                    "threeday_percentage": i.threeday_percentage_closed,
                    "fourday_percentage": i.fourday_percentage_closed,
                    "fiveday_percentage": i.fiveday_percentage_closed,
                    "sixday_percentage": i.sixday_percentage_closed,
                    "sevenday_percentage": i.sevenday_percentage_closed,
                    "sevenplusday_percentage": i.sevenplusday_percentage_closed
                }]
            })
            counter++;
        }

        if (isExport === 'true') {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Tickets Analysis");
            worksheet.mergeCells('I1', 'Q1');
            worksheet.getCell('I1').value = 'Aging Analysis of Overdue tickets In Numbers'
            worksheet.mergeCells('R1', 'Z1');
            worksheet.getCell('R1').value = 'Aging Analysis of Overdue tickets in %'

            worksheet.mergeCells('AA1', 'AI1');
            worksheet.getCell('AA1').value = 'Aging Analysis of Closed tickets In Numbers'
            worksheet.mergeCells('AJ1', 'AR1');
            worksheet.getCell('AJ1').value = 'Aging Analysis of Closed tickets in %'

            /*Column headers*/
            worksheet.getRow(2).values = ['S.No', 'LeadName','Department Name', 'Total Tickets Assigned', 'Open', 'Closed', 'Overdue', '% Closed', '% Overdue', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days', '0 Day', '1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '7 Days', '>7 Days'];

            worksheet.getRow(2).font = { bold: true };
            worksheet.getRow(1).font = { bold: true };
            worksheet.columns = [
                { key: 'SNo' },
                { key: 'Agent Name' },
                { key: 'Department Name' },
                { key: 'TotalAssignedTickets' },
                { key: 'Open' },
                { key: 'Closed' },
                { key: 'Overdue' },
                { key: 'ClosedPercent' },
                { key: 'OverduePercent' },
                { key: 'OverdueZeroDay' },
                { key: 'OverdueOneDay' },
                { key: 'OverdueTwoDay' },
                { key: 'OverdueThreeDay' },
                { key: 'OverdueFourDay' },
                { key: 'OverdueFiveDay' },
                { key: 'OverdueSixDay' },
                { key: 'OverdueSevenDay' },
                { key: 'OverdueGreaterSevenDay' },
                { key: 'OverdueZeroPercent' },
                { key: 'OverdueOnePercent' },
                { key: 'OverdueTwoPercent' },
                { key: 'OverdueThreePercent' },
                { key: 'OverdueFourPercent' },
                { key: 'OverdueFivePercent' },
                { key: 'OverdueSixPercent' },
                { key: 'OverdueSevenPercent' },
                { key: 'OverdueGreaterSevenPercent' },
                { key: 'ClosedZeroDay' },
                { key: 'ClosedOneDay' },
                { key: 'ClosedTwoDay' },
                { key: 'ClosedThreeDay' },
                { key: 'ClosedFourDay' },
                { key: 'ClosedFiveDay' },
                { key: 'ClosedSixDay' },
                { key: 'ClosedSevenDay' },
                { key: 'ClosedGreaterSevenDay' },
                { key: 'ClosedZeroPercent' },
                { key: 'ClosedOnePercent' },
                { key: 'ClosedTwoPercent' },
                { key: 'ClosedThreePercent' },
                { key: 'ClosedFourPercent' },
                { key: 'ClosedFivePercent' },
                { key: 'ClosedSixPercent' },
                { key: 'ClosedSevenPercent' },
                { key: 'ClosedGreaterSevenPercent' },
            ]


            //<Start--Overdue Row>    
            respArray.forEach(function (item, index) {
                worksheet.addRow({
                    'SNo': item.SNo,
                    'Agent Name': item.AgentName,
                    'Department Name': item.DepartmentName,
                    'TotalAssignedTickets': item.TotalAssignedTickets,
                    'Open': item.OpenCount,
                    'Closed': item.ClosedCount,
                    'Overdue': item.OverdueCount,
                    'ClosedPercent': item.ClosedPercentage,
                    'OverduePercent': item.OverduePercentage,
                    'OverdueZeroDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday),
                    'OverdueOneDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday),
                    'OverdueTwoDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday),
                    'OverdueThreeDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday),
                    'OverdueFourDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday),
                    'OverdueFiveDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday),
                    'OverdueSixDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday),
                    'OverdueSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday),
                    'OverdueGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday),
                    'OverdueZeroPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].zeroday_percentage),
                    'OverdueOnePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].oneday_percentage),
                    'OverdueTwoPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].twoday_percentage),
                    'OverdueThreePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].threeday_percentage),
                    'OverdueFourPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fourday_percentage),
                    'OverdueFivePercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].fiveday_percentage),
                    'OverdueSixPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sixday_percentage),
                    'OverdueSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenday_percentage),
                    'OverdueGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.OverdueAging[0].sevenplusday_percentage),

                    'ClosedZeroDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday),
                    'ClosedOneDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday),
                    'ClosedTwoDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday),
                    'ClosedThreeDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday),
                    'ClosedFourDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday),
                    'ClosedFiveDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday),
                    'ClosedSixDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday),
                    'ClosedSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday),
                    'ClosedGreaterSevenDay': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday),
                    'ClosedZeroPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].zeroday_percentage),
                    'ClosedOnePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].oneday_percentage),
                    'ClosedTwoPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].twoday_percentage),
                    'ClosedThreePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].threeday_percentage),
                    'ClosedFourPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fourday_percentage),
                    'ClosedFivePercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].fiveday_percentage),
                    'ClosedSixPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sixday_percentage),
                    'ClosedSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenday_percentage),
                    'ClosedGreaterSevenPercent': generalMethodsController.getZeroForNullValue(item.ClosedAging[0].sevenplusday_percentage),
                })

            })

            //Add Total Count row in last
            worksheet.addRow({
                'SNo': ' ',
                'LeadName': 'Total',
                'TotalAssignedTickets': grandTotalCount,
                'Open': grandTotalOpenCount,
                'Closed': grandTotalClosedCount,
                'Overdue': grandTotalOpenCount,
                'ClosedPercent': grandTotalClosedPercentage + '%',
                'OverduePercent': grandTotalOverduePercentage + '%',
            })
            //<End--Overdue Row>    



            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ticketsAnalysis.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            //<Sort the data>
            let sortedResp = [];
            if (orderBy === "SNo" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.SNo - a.SNo)
            } else if (orderBy === "SNo" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.SNo - b.SNo)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.TotalAssignedTickets - a.TotalAssignedTickets)
            } else if (orderBy === "TotalAssignedTickets" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.TotalAssignedTickets - b.TotalAssignedTickets)
            } else if (orderBy === "OpenCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OpenCount - a.OpenCount)
            } else if (orderBy === "OpenCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OpenCount - b.OpenCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.ClosedCount - a.ClosedCount)
            } else if (orderBy === "ClosedCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.ClosedCount - b.ClosedCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => b.OverdueCount - a.OverdueCount)
            } else if (orderBy === "OverdueCount" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => a.OverdueCount - b.OverdueCount)
            } else if (orderBy === "OverduePercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)))
            } else if (orderBy === "OverduePercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.OverduePercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.OverduePercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "asc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)))
            } else if (orderBy === "ClosedPercentage" && orderDirection === "desc") {
                sortedResp = respArray.sort((a, b) => parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(a.ClosedPercentage)) - parseFloat(generalMethodsController.remove_Percent_Symbol_FromValue(b.ClosedPercentage)))
            } else {
                sortedResp = respArray;
            }

            //</Sort the data>
            res.send([{
                "GrandTotal": grandTotalCount,
                "GrandOpenTotal": grandTotalOpenCount,
                "GrandClosedCount": grandTotalClosedCount,
                "GrandClosedPercentage": grandTotalClosedPercentage + "%",
                "GrandOverdueCount": grandTotalOverdueCount,
                "GrandOverDuePercentage": grandTotalOverduePercentage + "%",
                "Data": sortedResp
            }]);
        }



    } catch (exception) {
        console.log(exception);
        res.status(200).send({
            message: "Some error occurred while retrieving tickets."
        });
    }
}