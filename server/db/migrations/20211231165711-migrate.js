"use strict";

const { Message, Conversation } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // build out the user-conversation table

      await queryInterface.createTable(
        "user-conversations",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          userId: {
            type: Sequelize.INTEGER,
            foreignKey: true,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          conversationId: {
            type: Sequelize.INTEGER,
            foreignKey: true,
            allowNull: false,
            references: {
              model: "conversations",
              key: "id",
            },
          },
        },
        { transaction }
      );

      // set up the assoscations

      Message.assosciate = function (models) {
        Message.belongsToMany(models.Conversation, {
          through: "user-conversations",
        }),
          { transaction };
      };

      Conversation.assosciate = function (models) {
        Conversation.belongsToMany(models.User, {
          through: "user-conversations",
        }),
          { transaction };
      };

      // get the old data and convert it to the new format
      // and push it into the new table

      const data = await Conversation.findAll();

      let newData = [];

      data.map((conversation) => {
        newData.push({
          userId: conversation.dataValues.user1Id,
          conversationId: conversation.dataValues.id,
        });
        newData.push({
          userId: conversation.dataValues.user2Id,
          conversationId: conversation.dataValues.id,
        });
        return;
      });

      await queryInterface.bulkInsert("user-conversations", newData, {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("user-conversations", { transaction });
      await transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  },
};
