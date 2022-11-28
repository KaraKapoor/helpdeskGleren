module.exports = (sequelize, Sequelize) => {
    const Department = sequelize.define("departments", {
        name: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return Department;
};
