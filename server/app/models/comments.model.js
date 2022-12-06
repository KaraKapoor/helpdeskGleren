module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comments", {
      created_by: {
        type: Sequelize.INTEGER,
      },
      html_text: {
        type: Sequelize.STRING(800),
      },
      plain_text: {
        type: Sequelize.STRING(800)
      },
      ticket_id: {
        type: Sequelize.INTEGER
      }
    });
  
    return Comments;
  };
  