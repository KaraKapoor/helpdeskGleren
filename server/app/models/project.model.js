module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("projects", {
        name: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return Project;
};
