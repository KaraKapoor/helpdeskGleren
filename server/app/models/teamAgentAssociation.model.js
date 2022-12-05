module.exports = (sequelize, Sequelize) => {
    const TeamAgentAssociation = sequelize.define("team_agent_association", {
        team_id: {
            type: Sequelize.INTEGER,
        },
        team_lead_id: {
            type: Sequelize.INTEGER,
        },
        agent_id: {
            type: Sequelize.INTEGER,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        department_id: {
            type: Sequelize.INTEGER,
        },
        project_id: {
            type: Sequelize.INTEGER,
        }
    });

    return TeamAgentAssociation;
};
