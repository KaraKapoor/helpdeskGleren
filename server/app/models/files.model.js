module.exports = (sequelize, Sequelize) => {
    const Files = sequelize.define("file", {
        ticketId: {
            type: Sequelize.INTEGER,
        },
        fileKey: {
            type: Sequelize.STRING,
        }
    });

    return Files;
};
