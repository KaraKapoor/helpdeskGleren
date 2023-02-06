module.exports = (sequelize, Sequelize) => {
    const Lables = sequelize.define("lables", {
        name: {
            type: Sequelize.STRING(255),
        }
    });

    return Lables;
};