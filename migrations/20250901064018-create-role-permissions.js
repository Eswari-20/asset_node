'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      permissions_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      role_id: { type: Sequelize.INTEGER },
      module_id: { type: Sequelize.INTEGER },
      action_id: { type: Sequelize.INTEGER },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      created_on: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_on: { type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};
