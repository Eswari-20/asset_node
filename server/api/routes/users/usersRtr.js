const express = require('express');
const router = express.Router();
const UserController = require('../../modules/users/controllers/users.controller');

console.log('👥 Loading users routes...');

// ========== USER ROUTES ==========
router.post('/', UserController.createUser);          // Create user
router.get('/', UserController.getAllUsers);         // Get all users
router.put('/', UserController.updateUser);          // Update user
router.delete('/', UserController.deleteUser);       // Delete user

console.log('✅ Users routes loaded');

module.exports = router;
