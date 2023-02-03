module.exports = (sequelize, Sequelize) => {
    const Lables = sequelize.define("lables", {
        lable: {
            type: Sequelize.STRING(255),
        },
        tenant_id:{
            type: Sequelize.INTEGER
        },ticket_id:{
            type: Sequelize.INTEGER
        }
    });

    return Lables;
};