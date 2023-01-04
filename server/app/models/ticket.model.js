module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("tickets", {
        created_by: {
            type: Sequelize.INTEGER,
        },
        department_id:{
            type: Sequelize.INTEGER,
        },
        project_id:{
            type: Sequelize.INTEGER,
        },
        assignee_id:{
            type: Sequelize.INTEGER,
        },
        category:{
            type: Sequelize.STRING,
        },
        status_id:{
            type: Sequelize.INTEGER,
        },
        priority:{
            type: Sequelize.STRING,
        },
        issue_details:{
            type: Sequelize.STRING,
        },
        issue_summary:{
            type: Sequelize.STRING,
        },
        due_dt:{
            type: Sequelize.DATE,
        },
        level1SlaDue:{
            type: Sequelize.DATE
        },
        level2SlaDue:{
            type: Sequelize.DATE
        },
        level3SlaDue:{
            type: Sequelize.DATE
        },
        level4SlaDue:{
            type: Sequelize.DATE
        },
        level5SlaDue:{
            type: Sequelize.DATE
        },
        level6SlaDue:{
            type: Sequelize.DATE
        },
        level1SlaTriggered:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        level2SlaTriggered:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        level3SlaTriggered:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        level4SlaTriggered:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        level5SlaTriggered:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        level6SlaTriggered:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        closed_dt:{
            type: Sequelize.DATE
        },
        closed_by:{
            type: Sequelize.INTEGER
        },
        is_overdue:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        reviewed_by:{
            type: Sequelize.INTEGER
        },
        tested_by:{
            type: Sequelize.INTEGER
        },
        resolved_by:{
            type: Sequelize.INTEGER
        },
        story_points:{
            type: Sequelize.INTEGER
        },
    });

    return Ticket;
};
