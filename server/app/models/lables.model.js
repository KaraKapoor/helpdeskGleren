module.exports = (sequelize, Sequelize) => {
    const Lables = sequelize.define("lables", {
        lable: {
            type: Sequelize.STRING(255),
        },
    });

    return Lables;
};