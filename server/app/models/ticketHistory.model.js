module.exports = (sequelize, Sequelize) => {
    const TicketHistory = sequelize.define("tickethistory", {
        email: {
            type: Sequelize.STRING,
        },
        fullName: {
            type: Sequelize.STRING,
        },
        ticketNotice: {
            type: Sequelize.BOOLEAN,
        },
        ticketSourceId: {
            type: Sequelize.INTEGER,
        },
        departmentId: {
            type: Sequelize.INTEGER,
        },
        helpTopicId: {
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        slaPlan: {
            type: Sequelize.STRING,
        },
        assigneeFullName: {
            type: Sequelize.STRING,
        },
        assigneeId: {
            type: Sequelize.INTEGER,
        },
        ticketStatus: {
            type: Sequelize.STRING
        },
        branch: {
            type: Sequelize.STRING
        },
        schCol: {
            type: Sequelize.STRING
        },
        ticketCategory: {
            type: Sequelize.STRING
        },
        ticketSubCategory: {
            type: Sequelize.STRING
        },
        dynamicFormJson: {
            type: Sequelize.JSON
        },
        dynamicFormField1: {
            type: Sequelize.STRING
        },
        dynamicFormField2: {
            type: Sequelize.STRING
        },
        dynamicFormField3: {
            type: Sequelize.STRING
        },
        dynamicFormField4: {
            type: Sequelize.STRING
        },
        dynamicFormField5: {
            type: Sequelize.STRING
        },
        dynamicFormField6: {
            type: Sequelize.STRING
        },
        dynamicFormField7: {
            type: Sequelize.STRING
        },
        dynamicFormField8: {
            type: Sequelize.STRING
        },
        dynamicFormField9: {
            type: Sequelize.STRING
        },
        dynamicFormField10: {
            type: Sequelize.STRING
        },
        dynamicFormField11: {
            type: Sequelize.STRING
        },
        dynamicFormField12: {
            type: Sequelize.STRING
        },
        dynamicFormField13: {
            type: Sequelize.STRING
        },
        dynamicFormField14: {
            type: Sequelize.STRING
        },
        dynamicFormField15: {
            type: Sequelize.STRING
        },
        dynamicFormField16: {
            type: Sequelize.STRING
        },
        dynamicFormField17: {
            type: Sequelize.STRING
        },
        dynamicFormField18: {
            type: Sequelize.STRING
        },
        dynamicFormField19: {
            type: Sequelize.STRING
        },
        dynamicFormField20: {
            type: Sequelize.STRING
        },
        dynamicFormField21: {
            type: Sequelize.STRING
        },
        dynamicFormField22: {
            type: Sequelize.STRING
        },
        dynamicFormField23: {
            type: Sequelize.STRING
        },
        dynamicFormField24: {
            type: Sequelize.STRING
        },
        dynamicFormField25: {
            type: Sequelize.STRING
        },
        dynamicFormField26: {
            type: Sequelize.STRING
        },
        dynamicFormField27: {
            type: Sequelize.STRING
        },
        dynamicFormField28: {
            type: Sequelize.STRING
        },
        dynamicFormField29: {
            type: Sequelize.STRING
        },
        dynamicFormField30: {
            type: Sequelize.STRING
        },
        dynamicFormField31: {
            type: Sequelize.STRING
        },
        dynamicFormField32: {
            type: Sequelize.STRING
        },
        dynamicFormField33: {
            type: Sequelize.STRING
        },
        dynamicFormField34: {
            type: Sequelize.STRING
        },
        dynamicFormField35: {
            type: Sequelize.STRING
        },
        dynamicFormField36: {
            type: Sequelize.STRING
        },
        dynamicFormField37: {
            type: Sequelize.STRING
        },
        dynamicFormField38: {
            type: Sequelize.STRING
        },
        dynamicFormField39: {
            type: Sequelize.STRING
        },
        dynamicFormField40: {
            type: Sequelize.STRING
        },
        slaPlanInMinutes: {
            type: Sequelize.STRING
        },
        level1SlaDue: {
            type: Sequelize.DATE
        },
        level2SlaDue: {
            type: Sequelize.DATE
        },
        level3SlaDue: {
            type: Sequelize.DATE
        },
        level4SlaDue: {
            type: Sequelize.DATE
        },
        level5SlaDue: {
            type: Sequelize.DATE
        },
        hodSlaDue: {
            type: Sequelize.DATE
        },
        level1SlaTriggered: {
            type: Sequelize.BOOLEAN
        },
        level2SlaTriggered: {
            type: Sequelize.BOOLEAN
        },
        level3SlaTriggered: {
            type: Sequelize.BOOLEAN
        },
        level4SlaTriggered: {
            type: Sequelize.BOOLEAN
        },
        level5SlaTriggered: {
            type: Sequelize.BOOLEAN
        },
        hodSlaTriggered: {
            type: Sequelize.BOOLEAN
        },
        closedDate: {
            type: Sequelize.DATE
        },
        employeeNo: {
            type: Sequelize.INTEGER
        },
        isTicketWronglyAssigned: {
            type: Sequelize.INTEGER
        },
        isTicketTransferred: {
            type: Sequelize.INTEGER
        },
        isTicketWithCentralPool: {
            type: Sequelize.INTEGER
        },
        openDepartmentIdOfUser: {
            type: Sequelize.STRING
        },
        transferreId: {
            type: Sequelize.INTEGER
        },
        transferreEmail: {
            type: Sequelize.STRING
        },
        isTicketOverdue: {
            type: Sequelize.STRING
        },
        reopenThreadCount: {
            type: Sequelize.INTEGER
        },
        ticketSatisfaction: {
            type: Sequelize.STRING
        },
        feedbacklinkId: {
            type: Sequelize.STRING
        },
        closedBy: {
            type: Sequelize.STRING
        },
        closedById: {
            type: Sequelize.INTEGER
        },
        isTicketSource: {
            type: Sequelize.BOOLEAN
        },
        ticketSourceHistoryId: {
            type: Sequelize.INTEGER
        },
        assigneeBranchCode: {
            type: Sequelize.STRING
        },
        updatedBy: {
            type: Sequelize.STRING
        },
        activeEscalationLevel: {
            type: Sequelize.STRING
        },
        activeEscalatedId: {
            type: Sequelize.INTEGER
        },
        emailsInvolvedInTicket: {
            type: Sequelize.STRING
        },
        initialCreatedDate: {
            type: Sequelize.DATE
        },
        modifiedSlaPlan: {
            type: Sequelize.STRING
        },
        createdBy: {
          type: Sequelize.INTEGER
        },
        nspiraCode: {
          type: Sequelize.STRING
        },
        state: {
          type: Sequelize.STRING
        },
        district: {
          type: Sequelize.STRING
        },
        payrollCode: {
            type: Sequelize.STRING,
        },

    });
    return TicketHistory;
};
