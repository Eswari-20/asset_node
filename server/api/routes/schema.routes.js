const express = require('express');
const router = express.Router();
const setupDatabase = require('../../../config/sequelize-helper');

router.post('/create', async (req, res) => { 
  try {
    const { database, username, password, host, dialect } = req.body;

    if (!database || !username || !password) {
      return res.status(400).json({ error: 'Database name, username, and password are required' });
    }

    await setupDatabase({ database, username, password, host, dialect });

    return res.status(200).json({ message: `✅ Schema ${database} created and initialized successfully.` });
  } catch (error) {
    console.error('Error creating schema:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
