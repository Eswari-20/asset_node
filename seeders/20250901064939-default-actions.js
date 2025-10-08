'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('actions', [
      {
        module_id: 1,
        action_name: 'Create',
        action_code: 'CREATE',
        action_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      },
      {
        module_id: 1,
        action_name: 'Update',
        action_code: 'UPDATE',
        action_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      },
      {
        module_id: 1,
        action_name: 'Delete',
        action_code: 'DELETE',
        action_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('actions', null, {});
  }
};
