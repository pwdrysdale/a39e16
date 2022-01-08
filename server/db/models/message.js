const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("messages", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  read: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = Message;
