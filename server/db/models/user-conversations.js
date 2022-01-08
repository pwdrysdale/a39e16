const db = require("../db");

// user-conversations table - a table that links users to conversations

const UserConversation = db.define("user-conversations", {
  userId: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  conversationId: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "conversations",
      key: "id",
    },
  },
});

module.exports = UserConversation;
