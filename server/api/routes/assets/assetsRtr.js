const express = require('express');
const router = express.Router();
const AssetController = require('../../modules/assets/controllers/assets.controller');

console.log('🔧 Loading assets routes...');

// ========== ASSET ROUTES ==========
router.post('/', AssetController.createAsset);         // Create asset
router.get('/', AssetController.getAllAssets);         // Get all assets
router.put('/', AssetController.updateAsset);          // Update asset
router.delete('/', AssetController.deleteAsset);       // Delete asset

// ========== PROCURE ROUTES ==========
router.post('/procure', AssetController.createprocure);        // Create procure
router.get('/procure', AssetController.getallprocure);        // Get all procure
router.put('/procure', AssetController.updateprocure);         // Update procure
router.delete('/procure', AssetController.deleteprocure);       // Delete procure

// ========== ASSET ALLOCATION ROUTES ==========
router.post('/allocate', AssetController.createAssetAllocation);        // Create asset allocation
router.get('/allocate', AssetController.getAllAssetAllocations);        // Get all asset allocations
router.put('/allocate', AssetController.updateAssetAllocation);         // Update asset allocation
router.delete('/allocate', AssetController.deleteAssetAllocation);       // Delete asset allocation

// ========== ASSET TRANSFER ROUTES ==========
router.post('/transfer', AssetController.createAssetTransfer);        // Create asset transfer
router.get('/transfer', AssetController.getAllAssetTransfers);        // Get all asset transfers
router.put('/transfer', AssetController.updateAssetTransfer);         // Update asset transfer
router.delete('/transfer', AssetController.deleteAssetTransfer);       // Delete asset transfer

// ========== ASSET FINANCIAL ROUTES ==========
router.post('/financial', AssetController.createAssetFinancial);        // Create asset financial
router.get('/financial', AssetController.getAllAssetFinancials);        // Get all asset financials
router.put('/financial', AssetController.updateAssetFinancial);         // Update asset financial
router.delete('/financial', AssetController.deleteAssetFinancial);       // Delete asset financial

// ========== ASSET DISPOSAL ROUTES ==========
router.post('/disposal', AssetController.createAssetDisposal);          // Create asset disposal
router.get('/disposal', AssetController.getAllAssetDisposals);          // Get all asset disposals
router.put('/disposal', AssetController.updateAssetDisposal);           // Update asset disposal
router.delete('/disposal', AssetController.deleteAssetDisposal);         // Delete asset disposal

console.log('✅ Assets routes loaded');

module.exports = router;
