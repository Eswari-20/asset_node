var jwt = require('jsonwebtoken');
const SECRET_KEY = 'glitsuserRamesh';
const { loginMdl, updatePasswordByUsername } = require('./models/authMdl');



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
    const user = results[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.name },
      SECRET_KEY,
      { expiresIn: '10m' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        token,
        created_at: user.created_at
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