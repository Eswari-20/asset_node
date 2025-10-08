const { exec } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname); // Adjust if needed

const runMigration = () => {
  return new Promise((resolve, reject) => {
    exec('npx sequelize-cli db:migrate', { cwd: projectDir }, (error, stdout, stderr) => {
      if (error) {
        reject(`Migration error: ${stderr}`);
      } else {
        resolve(`Migration success: ${stdout}`);
      }
    });
  });
};

const runSeeder = () => {
  return new Promise((resolve, reject) => {
    exec('npx sequelize-cli db:seed:all', { cwd: projectDir }, (error, stdout, stderr) => {
      if (error) {
        reject(`Seeder error: ${stderr}`);
      } else {
        resolve(`Seeder success: ${stdout}`);
      }
    });
  });
};

module.exports = { runMigration, runSeeder };
