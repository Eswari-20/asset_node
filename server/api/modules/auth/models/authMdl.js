const { getPool } = require('../../../../../config/db.config');

exports.loginMdl = (username, password) => {
  const QRY_TO_EXEC = `SELECT 
    id,
    name,
    password,
    forgot_password_token,
    created_at
  FROM 
    users
  WHERE 
    name = ? 
    AND password = MD5(?)`;

  const pool = getPool();
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('DB Connection Error:', err);
        return reject(err);
      }

      connection.query(QRY_TO_EXEC, [username, password], (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error('Query Error:', queryErr);
          return reject(queryErr);
        }

        // return ALL rows, not just one
        resolve(results.length > 0 ? results : null);
      });
    });
  });
};

// New: Update password for forgot-password
exports.updatePasswordByUsername = (username, newPassword) => {
  const pool = getPool();
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      const sql = 'UPDATE users SET password = MD5(?) WHERE name = ?';
      connection.query(sql, [newPassword, username], (queryErr, results) => {
        connection.release();
        if (queryErr) return reject(queryErr);
        resolve(results);
      });
    });
  });
};