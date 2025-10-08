const AssetModel = require('../models/assets.model');

// ========== ASSET CONTROLLERS ==========

// Create new asset
exports.createAsset = (req, res) => {
    try {
        const {
            asset_name, category, manufacturer_brand, model_number, serial_number,
            location, assigned_user, owning_department, building_facility, floor_room_number,
            gps_coordinates, purchase_date, warranty_expiry, amc_expiry, warranty_period_months,
            installation_date, order_number, supplier_vendor, current_book_value, original_purchase_price,
            asset_type, depreciation_method, invoice_receipt_files, ownership_proof_files,
            insurance_policy_files, lease_agreement_files
        } = req.body;

        // Validate required fields
        if (!asset_name || !category || !manufacturer_brand || !model_number || 
            !serial_number || !location || !assigned_user || !owning_department || 
            !purchase_date || !warranty_expiry || !current_book_value || 
            !supplier_vendor || !original_purchase_price) {
            return res.status(400).json({
                success: false,
                message: 'asset_name, category, manufacturer_brand, model_number, serial_number, location, assigned_user, owning_department, purchase_date, warranty_expiry, current_book_value, supplier_vendor, and original_purchase_price are required'
            });
        }

        AssetModel.createAsset(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAsset controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all assets
exports.getAllAssets = (req, res) => {
    try {
        AssetModel.getAllAssets((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAllAssets controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update asset
exports.updateAsset = (req, res) => {
    try {
        const { asset_id } = req.body;
        
        if (!asset_id) {
            return res.status(400).json({
                success: false,
                message: 'asset_id is required in request body'
            });
        }

        AssetModel.updateAsset(asset_id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Asset not found or no changes made') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAsset controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete asset
exports.deleteAsset = (req, res) => {
    try {
        const { asset_id } = req.body;
        
        if (!asset_id) {
            return res.status(400).json({
                success: false,
                message: 'asset_id is required in request body'
            });
        }

        AssetModel.deleteAsset(asset_id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Asset not found') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAsset controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== PROCURE CONTROLLERS ==========

// Create new procure
exports.createprocure = (req, res) => {
    try {
        const {
            indent_number, requested_by, requested_date, status, category,
            asset_name, quantity, po_number, supplier_vendor, received_date,
            invoice_details, justification
        } = req.body;

        // Validate required fields
        if (!indent_number || !requested_by || !requested_date || !status || 
            !category || !asset_name || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'indent_number, requested_by, requested_date, status, category, asset_name, and quantity are required'
            });
        }

        AssetModel.createIndent(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createprocure controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all procure
exports.getallprocure = (req, res) => {
    try {
        AssetModel.getAllIndents((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getallprocure controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update procure
exports.updateprocure = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.updateIndent(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateprocure controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete procure
exports.deleteprocure = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.deleteIndent(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteprocure controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== ASSET ALLOCATION CONTROLLERS ==========

// Create new asset allocation
exports.createAssetAllocation = (req, res) => {
    try {
        const {
            asset_id, assignment_date, assignment_type, return_date,
            assigned_to, assigned_by, assignment_notes, condition_at_issue
        } = req.body;

        // Validate required fields
        if (!asset_id || !assignment_date || !assignment_type || !assigned_to || !assigned_by) {
            return res.status(400).json({
                success: false,
                message: 'asset_id, assignment_date, assignment_type, assigned_to, and assigned_by are required'
            });
        }

        AssetModel.createAssetAllocation(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAssetAllocation controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all asset allocations
exports.getAllAssetAllocations = (req, res) => {
    try {
        AssetModel.getAllAssetAllocations((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetAllocations controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get asset allocation by ID
exports.getAssetAllocationById = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.getAssetAllocationById(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAssetAllocationById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update asset allocation
exports.updateAssetAllocation = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.updateAssetAllocation(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAssetAllocation controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete asset allocation
exports.deleteAssetAllocation = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.deleteAssetAllocation(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetAllocation controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== ASSET TRANSFER CONTROLLERS ==========

// Create new asset transfer
exports.createAssetTransfer = (req, res) => {
    try {
        const {
            transfer_id, asset_id, current_location_or_user, new_location_or_user,
            transfer_date, justification, approver_name
        } = req.body;

        // Validate required fields
        if (!transfer_id || !asset_id || !current_location_or_user || !new_location_or_user || !transfer_date) {
            return res.status(400).json({
                success: false,
                message: 'transfer_id, asset_id, current_location_or_user, new_location_or_user, and transfer_date are required'
            });
        }

        AssetModel.createAssetTransfer(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAssetTransfer controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all asset transfers
exports.getAllAssetTransfers = (req, res) => {
    try {
        AssetModel.getAllAssetTransfers((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetTransfers controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get asset transfer by ID
exports.getAssetTransferById = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.getAssetTransferById(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAssetTransferById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update asset transfer
exports.updateAssetTransfer = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.updateAssetTransfer(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAssetTransfer controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete asset transfer
exports.deleteAssetTransfer = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.deleteAssetTransfer(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetTransfer controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== ASSET FINANCIAL CONTROLLERS ==========

// Create new asset financial record
exports.createAssetFinancial = (req, res) => {
    try {
        const {
            asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
            monthly_depreciation, accumulated_depreciation, general_ledger_code
        } = req.body;

        // Validate required fields
        if (!asset_id || !depreciation_method || !purchase_value) {
            return res.status(400).json({
                success: false,
                message: 'asset_id, depreciation_method, and purchase_value are required'
            });
        }

        AssetModel.createAssetFinancial(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAssetFinancial controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all asset financial records
exports.getAllAssetFinancials = (req, res) => {
    try {
        AssetModel.getAllAssetFinancials((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetFinancials controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get asset financial record by ID
exports.getAssetFinancialById = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.getAssetFinancialById(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAssetFinancialById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update asset financial record
exports.updateAssetFinancial = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.updateAssetFinancial(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAssetFinancial controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete asset financial record
exports.deleteAssetFinancial = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.deleteAssetFinancial(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetFinancial controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== ASSET DISPOSAL CONTROLLERS ==========

// Create new asset disposal
exports.createAssetDisposal = (req, res) => {
    try {
        const {
            asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
            sale_price, book_value, buyer_name
        } = req.body;

        // Validate required fields
        if (!asset_code || !disposal_type || !disposal_date || !approver_name) {
            return res.status(400).json({
                success: false,
                message: 'asset_code, disposal_type, disposal_date, and approver_name are required'
            });
        }

        AssetModel.createAssetDisposal(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAssetDisposal controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all asset disposals
exports.getAllAssetDisposals = (req, res) => {
    try {
        AssetModel.getAllAssetDisposals((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetDisposals controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get asset disposal by ID
exports.getAssetDisposalById = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.getAssetDisposalById(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAssetDisposalById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update asset disposal
exports.updateAssetDisposal = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.updateAssetDisposal(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAssetDisposal controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete asset disposal
exports.deleteAssetDisposal = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        AssetModel.deleteAssetDisposal(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetDisposal controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};