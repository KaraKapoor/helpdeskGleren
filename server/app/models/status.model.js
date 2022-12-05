module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("status", {
        name: {
            type: Sequelize.STRING,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        status_type:{
            type: Sequelize.ENUM("ToDo", "InProgress", "Close"),
        }
    });

    return Status;
};
