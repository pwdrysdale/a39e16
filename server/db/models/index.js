const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// https://medium.com/@eth3rnit3/sequelize-relationships-ultimate-guide-f26801a75554

// associations

// User.hasMany(Conversation);
// Conversation.belongsTo(User, { as: "user1" });
// Conversation.belongsTo(User, { as: "user2" });
Conversation.belongsToMany(User, {
  through: "user-conversations",
  as: "users",
});
User.belongsToMany(Conversation, {
  through: "user-conversations",
  as: "conversations",
});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
};
