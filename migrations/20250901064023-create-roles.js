'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      role_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      role_name: { type: Sequelize.STRING, allowNull: false },
      role_code: { type: Sequelize.STRING, allowNull: false },
      role_status: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_by: { type: Sequelize.INTEGER },
      created_on: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_by: { type: Sequelize.INTEGER },
      updated_on: { type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
