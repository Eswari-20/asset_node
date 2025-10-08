var jwt = require('jsonwebtoken');
const approot = '/glits/web/code/CMS-Node/node/';
const df = require('../../../../../utils/dflower.utils');
const SECRET_KEY = 'glitsuserRamesh';
const { loginMdl, updatePasswordByUsername } = require('../../../modules/auth/models/authMdl');


const crypto = require('crypto');
const { platform } = require('os');



exports.loginCtrl = async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.trim().toLowerCase();
    password = password?.trim();

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const results = await loginMdl(username, password);
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Invalid Username or password' });
    }

    // User info from first row
    const baseUser = {
      username: results[0].username,
      email: results[0].email,
      role_id: results[0].role_id,
      role_name: results[0].role_name,
      role_code: results[0].role_code,
      role_status: results[0].role_status
    };

    // Group modules and actions
    const modulesMap = {};
    results.forEach(row => {
      if (!row.module_id) return; // skip if no module

      if (!modulesMap[row.module_id]) {
        modulesMap[row.module_id] = {
          module_id: row.module_id,
          module_name: row.module_name,
          module_code: row.module_code,
          actions: []
        };
      }

      modulesMap[row.module_id].actions.push({
        action_id: row.action_id,
        action_name: row.action_name,
        action_code: row.action_code
      });
    });

    const modules = Object.values(modulesMap);

    // Generate JWT
    const token = jwt.sign(
      { userId: results[0].user_id, username: baseUser.username },
      SECRET_KEY,
      { expiresIn: '10m' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        ...baseUser,
        token,
        modules
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Forgot Password Controller (username only)
exports.forgotPasswordCtrl = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ message: 'Username and new password are required' });
    }

    // Update password in DB
    const result = await updatePasswordByUsername(username.trim().toLowerCase(), newPassword);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Username not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
