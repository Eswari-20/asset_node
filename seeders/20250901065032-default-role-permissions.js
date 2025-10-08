'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role_permissions', [
      // Role 1 Permissions
      {
        role_id: 1,
        module_id: 1,
        action_id: 1,
        created_by: 1,
        updated_by: 1,
        created_on: new Date(),
        updated_on: new Date()
      },
      {
        role_id: 1,
        module_id: 1,
        action_id: 2,
        created_by: 1,
        updated_by: 1,
        created_on: new Date(),
        updated_on: new Date()
      },

      // Role 2 Permissions
      {
        role_id: 2,
        module_id: 2,
        action_id: 1,
        created_by: 1,
        updated_by: 1,
        created_on: new Date(),
        updated_on: new Date()
      },
      {
        role_id: 2,
        module_id: 2,
        action_id: 2,
        created_by: 1,
        updated_by: 1,
        created_on: new Date(),
        updated_on: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
