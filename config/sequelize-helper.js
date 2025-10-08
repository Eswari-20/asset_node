const { Sequelize } = require('sequelize');
const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');

async function setupDatabase({ database, username, password, host, dialect }) {
  // 1. Use root DB to create schema if not exists
  const rootSequelize = new Sequelize('mysql', 'root', 'your_root_password', {
    host: host || '127.0.0.1',
    dialect: dialect || 'mysql',
    logging: false,
  });

  await rootSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // 2. Connect to new schema using user credentials
  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to ${database}`);
  } catch (err) {
    throw new Error(`❌ Failed to connect: ${err.message}`);
  }

  // 3. Run migrations
  const migrator = new Umzug({
    migrations: { glob: path.join(__dirname, '../migrations/*.js') },
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });
  await migrator.up();

  // 4. Run seeders
  const seeder = new Umzug({
    migrations: { glob: path.join(__dirname, '../seeders/*.js') },
    storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeData' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });
  await seeder.up();

  return sequelize;
}

module.exports = setupDatabase;
