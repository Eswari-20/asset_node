'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('module_master', {
      module_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      module_name: { type: Sequelize.STRING, allowNull: false },
      module_code: { type: Sequelize.STRING, allowNull: false },
      module_status: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_by: { type: Sequelize.INTEGER },
      updated_by: { type: Sequelize.INTEGER },
      created_on: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_on: { type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('module_master');
  }
};
