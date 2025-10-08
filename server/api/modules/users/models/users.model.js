const { getPool } = require("../../../../../config/db.config");
const crypto = require("crypto");

class UserModel {
    constructor() {
        console.log('UserModel initialized');
    }

    // ========== USER OPERATIONS ==========

    // Create a new user
    createUser(data, callback) {
        try {
            const { name, password } = data;

            // Hash the password
            const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

            const query = `
                INSERT INTO users (name, password)
                VALUES (?, ?)
            `;

            const values = [name, hashedPassword];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in createUser:', error);
                    if (error.code === 'ER_DUP_ENTRY') {
                        callback({
                            success: false,
                            message: 'User already exists'
                        });
                    } else {
                        callback({
                            success: false,
                            message: 'Database error',
                            details: error.message
                        });
                    }
                } else {
                    callback({
                        success: true,
                        user_id: results.insertId,
                        message: 'User created successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in createUser:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get all users
    getAllUsers(callback) {
        try {
            const query = `
                SELECT id, name, created_at
                FROM users 
                ORDER BY created_at DESC
            `;

            getPool().query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllUsers:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        users: results,
                        message: 'Users retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Update user
    updateUser(id, data, callback) {
        try {
            const { name, password } = data;

            let hashedPassword = null;
            if (password) {
                hashedPassword = crypto.createHash("md5").update(password).digest("hex");
            }

            let fields = [];
            let values = [];

            if (name) {
                fields.push("name = ?");
                values.push(name);
            }
            if (hashedPassword) {
                fields.push("password = ?");
                values.push(hashedPassword);
            }

            if (fields.length === 0) {
                return callback({
                    success: false,
                    message: 'No fields to update'
                });
            }

            const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
            values.push(id);

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in updateUser:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'User not found or no changes made'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'User updated successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in updateUser:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }


    // Delete user
    deleteUser(id, callback) {
        try {
            const query = `DELETE FROM users WHERE id = ?`;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in deleteUser:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'User not found'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'User deleted successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in deleteUser:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }
}

module.exports = new UserModel();
