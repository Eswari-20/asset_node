'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        role_name: 'Admin',
        role_code: 'ADMIN',
        role_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      },
      {
        role_name: 'User',
        role_code: 'USER',
        role_status: true,
        created_by: 1,
        created_on: new Date(),
        updated_by: 1,
        updated_on: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
