const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config/config.json")[env];

const db = new Sequelize(config);

try {
  db.authenticate();
  console.log("Connection has been established successfully.");
} catch (err) {
  console.error("Unable to connect to the database:", err);
}

// require("./models");

module.exports = db;
