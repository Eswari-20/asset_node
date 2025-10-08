'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('module_master', [
      {
        module_name: 'Dashboard',
        module_code: 'DASHBOARD',
        module_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      },
      {
        module_name: 'User Management',
        module_code: 'USER_MGMT',
        module_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      },
      {
        module_name: 'Roles & Permissions',
        module_code: 'ROLES_PERMISSIONS',
        module_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('module_master', null, {});
  }
};
