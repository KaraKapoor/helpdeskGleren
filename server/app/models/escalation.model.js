module.exports = (sequelize, Sequelize) => {
    const Escalation = sequelize.define("escalations", {
        l1_id: {
            type: Sequelize.INTEGER,
        },
        l2_id: {
            type: Sequelize.INTEGER,
        },
        l3_id: {
            type: Sequelize.INTEGER,
        },
        l4_id: {
            type: Sequelize.INTEGER,
        },
        l5_id: {
            type: Sequelize.INTEGER,
        },
        l6_id: {
            type: Sequelize.INTEGER,
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return Escalation;
};
