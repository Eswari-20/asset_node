'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loginHistory', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      platform: { type: Sequelize.STRING },
      loginTime: { type: Sequelize.DATE },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      token: { type: Sequelize.STRING },
      userId: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loginHistory');
  }
};
