module.exports = (sequelize, Sequelize) => {
    const Team = sequelize.define("team", {
        name: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_by:{
            type: Sequelize.INTEGER,
        },
        updated_by:{
            type: Sequelize.INTEGER
        }
    });

    return Team;
};
