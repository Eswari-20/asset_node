const express = require('express');
const router = express.Router();
const DisposalController = require('../../modules/disposal/controllers/disposal.controller');

console.log('🗑️ Loading disposal routes...');

// ========== DISPOSAL ROUTES ==========
router.post('/', DisposalController.createDisposal);          // Create disposal record
router.get('/', DisposalController.getAllDisposals);         // Get all disposal records
router.put('/', DisposalController.updateDisposal);          // Update disposal record
router.delete('/', DisposalController.deleteDisposal);       // Delete disposal record

console.log('✅ Disposal routes loaded');

module.exports = router;
