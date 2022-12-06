module.exports = (sequelize, Sequelize) => {
    const Uploads = sequelize.define("uploads", {
        field_name: {
            type: Sequelize.STRING
        },
        key: {
            type: Sequelize.STRING
        },
        path: {
            type: Sequelize.STRING
        },
        mime_type: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.STRING
        },
        original_name: {
            type: Sequelize.STRING
        },
        bucket: {
            type: Sequelize.STRING
        },
        uploaded_by: {
            type: Sequelize.INTEGER
        }
    });

    return Uploads;
};
