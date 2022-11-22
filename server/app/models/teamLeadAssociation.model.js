module.exports = (sequelize, Sequelize) => {
    const TeamLeadAssociation = sequelize.define("teamLead_association", {
        teamId: {
            type: Sequelize.INTEGER,
        },
        teamLeadId: {
            type: Sequelize.INTEGER,
        }
    });

    return TeamLeadAssociation;
};
