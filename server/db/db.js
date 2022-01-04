const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/messenger",
  {
    logging: false,
    // alter: true,
    // force: true,
  }
);

module.exports = db;
