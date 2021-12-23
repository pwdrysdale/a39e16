module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("Messages", "conversationId", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      await queryInterface.addColumn("Messages", "senderId", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      await queryInterface.addColumn("Messages", "read", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      }),
    ];
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Messages", "read");
  },
};
