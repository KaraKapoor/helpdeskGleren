module.exports = (sequelize, Sequelize) => {
    const Labels = sequelize.define("labels", {
        name: {
            type: Sequelize.STRING(255),
        }
    });

    return Labels;
};