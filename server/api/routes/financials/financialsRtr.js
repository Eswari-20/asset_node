const express = require('express');
const router = express.Router();
const FinancialsController = require('../../modules/financials/controllers/financials.controller');

console.log('💰 Loading financials routes...');

// ========== FINANCIALS ROUTES ==========
router.post('/', FinancialsController.createFinancial);          // Create financial record
router.get('/', FinancialsController.getAllFinancials);         // Get all financial records
router.put('/', FinancialsController.updateFinancial);          // Update financial record
router.delete('/', FinancialsController.deleteFinancial);       // Delete financial record

console.log('✅ Financials routes loaded');

module.exports = router;
