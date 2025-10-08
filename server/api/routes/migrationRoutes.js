const express = require('express');
const router = express.Router();
const path = require('path');
const { runMigration, runSeeder } = require(path.join(__dirname, '..', '..', '..', 'migrationService.js'));
router.post('/migrate', async (req, res) => {
  try {
    const result = await runMigration();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const result = await runSeeder();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
