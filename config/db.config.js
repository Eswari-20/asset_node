const mysql = require('mysql2');

var USER = 'harish';
var PWD = 'Digit@l456'; 
var DATABASE = 'asset_mgmt';
var DB_HOST_NAME = '202.53.92.35';
var DB_PORT = '3306';

const MAX_POOL_SIZE = 800;
let MySQLConPool = null;

const connectDB = () => {
  console.log('Attempting to connect to MySQL...');
  return new Promise((resolve, reject) => {
    MySQLConPool = mysql.createPool({
      host: DB_HOST_NAME,
      user: USER,
      password: PWD,
      database: DATABASE,
      port: DB_PORT,
      connectionLimit: MAX_POOL_SIZE,
      acquireTimeout: 5000,
      debug: false,
      multipleStatements: false,
      supportBigNumbers: true
    });

    MySQLConPool.getConnection((err, connection) => {
      if (err) {
        console.error(' Failed to connect to MySQL:', err.message);
        return reject(err);
      }
      console.log(' MySQL connected successfully!');
      connection.release();
      resolve(MySQLConPool);
    });

    MySQLConPool.on('acquire', (connection) => console.log('Connection acquired', connection.threadId));
    MySQLConPool.on('release', (connection) => console.log('Connection released', connection.threadId));
    MySQLConPool.on('enqueue', () => console.log('Waiting for available connection slot'));
  });
};

const getPool = () => {
  if (!MySQLConPool) throw new Error('MySQL pool not initialized. Call connectDB() first.');
  return MySQLConPool;
};

const query = (sql, params, callback) => {
  return getPool().query(sql, params, callback);
};

module.exports = { connectDB, getPool, query };
