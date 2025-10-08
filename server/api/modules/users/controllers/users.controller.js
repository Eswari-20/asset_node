const UserModel = require("../models/users.model");

class UserController {
    constructor() {
        console.log('UserController initialized');
    }

    // Create new user
    createUser(req, res) {
        try {
            const { name, password } = req.body;

            // Validate required fields
            if (!name || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'name and password are required'
                });
            }

            UserModel.createUser(req.body, (result) => {
                if (result.success) {
                    res.status(201).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in createUser controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }


    // Get all users
    getAllUsers(req, res) {
        try {
            UserModel.getAllUsers((result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getAllUsers controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Update user
    updateUser(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            UserModel.updateUser(id, req.body, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'User not found or no changes made') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in updateUser controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }


    // Delete user
    deleteUser(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            UserModel.deleteUser(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'User not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in deleteUser controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }
}

module.exports = new UserController();
