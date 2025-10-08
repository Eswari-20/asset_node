'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('plans_table', [
      { code: 'BASIC', name: 'Basic Plan' },
      { code: 'PREMIUM', name: 'Premium Plan' },
      { code: 'ENTERPRISE', name: 'Enterprise Plan' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plans_table', null, {});
  }
};
