module.exports = (sequelize, Sequelize) => {
    const NspiraDepartments = sequelize.define("nspiradepartments", {
        iddepartments: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        fullname: {
            type: Sequelize.STRING,
        },
        id: {
            type: Sequelize.STRING,
        },
        opendepartmentid: {
            type: Sequelize.STRING,
        },
        parent_id: {
            type: Sequelize.STRING,
        },
        parentOpenDepartmentId: {
            type: Sequelize.STRING,
        }
    });

    return NspiraDepartments;
};
