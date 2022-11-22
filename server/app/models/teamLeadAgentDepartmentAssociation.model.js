module.exports = (sequelize, Sequelize) => {
    const TeamLeadAgentDeptAssociation = sequelize.define("teamLead_agnt_dept_associations", {
        teamLeadAssociationId: {
            type: Sequelize.INTEGER,
        },
        teamId: {
            type: Sequelize.INTEGER,
        },
        teamLeadId: {
            type: Sequelize.INTEGER,
        },
        agentId: {
            type: Sequelize.INTEGER,
        },
        departmentId: {
            type: Sequelize.INTEGER,
        }
    });

    return TeamLeadAgentDeptAssociation;
};
