module.exports = (sequelize, Sequelize) => {
    const Teams = sequelize.define("teams", {
        teamName: {
            type: Sequelize.STRING,
        },
        createdBy: {
            type: Sequelize.STRING,
        },
        updatedBy: {
            type: Sequelize.STRING
        }
    });

    return Teams;
};
