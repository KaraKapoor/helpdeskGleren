module.exports = (sequelize, Sequelize) => {
    const AgentDepartmentMapping = sequelize.define("agent_dept_Mapping", {
        userId: {
            type: Sequelize.INTEGER,
        },
        departmentId: {
            type: Sequelize.INTEGER,
        },
        createdBy: {
            type: Sequelize.INTEGER,
        },
        updatedBy: {
            type: Sequelize.INTEGER,
        },
    });

    return AgentDepartmentMapping;
};
