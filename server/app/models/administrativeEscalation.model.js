module.exports = (sequelize, Sequelize) => {
    const AdministrativeEscalation = sequelize.define("administrativeescalation", {
        idadministrativeescalation: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        branch: {
            type: Sequelize.STRING,
        },
        nspiraCode: {
            type: Sequelize.STRING,
        },
        payrollCode: {
            type: Sequelize.STRING,
        },
        department: {
            type: Sequelize.STRING,
        },
        module: {
            type: Sequelize.STRING,
        },
        state: {
            type: Sequelize.STRING,
        },
        district: {
            type: Sequelize.STRING,
        },
        agm: {
            type: Sequelize.STRING,
        },
        blankcol: {
            type: Sequelize.STRING,
        },
        l1name: {
            type: Sequelize.STRING,
        },
        l1mobile: {
            type: Sequelize.STRING,
        },
        l1email: {
            type: Sequelize.STRING,
        },
        l2name: {
            type: Sequelize.STRING,
        },
        l2mobile: {
            type: Sequelize.STRING,
        },
        l2email: {
            type: Sequelize.STRING,
        },
        l3name: {
            type: Sequelize.STRING,
        },
        l3mobile: {
            type: Sequelize.STRING,
        },
        l3email: {
            type: Sequelize.STRING,
        },
        l4name: {
            type: Sequelize.STRING,
        },
        l4mobile: {
            type: Sequelize.STRING,
        },
        l4email: {
            type: Sequelize.STRING,
        },
        l5name: {
            type: Sequelize.STRING,
        },
        l5mobile: {
            type: Sequelize.STRING,
        },
        l5email: {
            type: Sequelize.STRING,
        },
        hodname: {
            type: Sequelize.STRING,
        },
        hodmobile: {
            type: Sequelize.STRING,
        },
        hodemail: {
            type: Sequelize.STRING,
        }

    });

    return AdministrativeEscalation;
};
