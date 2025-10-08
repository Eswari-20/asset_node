const { getPool } = require('../../../../../config/db.config');

// ========== ASSET OPERATIONS ==========

// Create a new asset
exports.createAsset = (data, callback) => {
    try {
        const {
            asset_name, category, manufacturer_brand, model_number, serial_number,
            location, assigned_user, owning_department, building_facility, floor_room_number,
            gps_coordinates, purchase_date, warranty_expiry, amc_expiry, warranty_period_months,
            installation_date, order_number, supplier_vendor, current_book_value, original_purchase_price,
            asset_type, depreciation_method, invoice_receipt_files, ownership_proof_files,
            insurance_policy_files, lease_agreement_files
        } = data;

        const query = `
            INSERT INTO assets (
                asset_name, category, manufacturer_brand, model_number, serial_number,
                location, assigned_user, owning_department, building_facility, floor_room_number,
                gps_coordinates, purchase_date, warranty_expiry, amc_expiry, warranty_period_months,
                installation_date, order_number, supplier_vendor, current_book_value, original_purchase_price,
                asset_type, depreciation_method, invoice_receipt_files, ownership_proof_files,
                insurance_policy_files, lease_agreement_files, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const values = [
            asset_name, category, manufacturer_brand, model_number, serial_number,
            location, assigned_user, owning_department, building_facility, floor_room_number,
            gps_coordinates, purchase_date, warranty_expiry, amc_expiry, warranty_period_months,
            installation_date, order_number, supplier_vendor, current_book_value, original_purchase_price,
            asset_type, depreciation_method, invoice_receipt_files, ownership_proof_files,
            insurance_policy_files, lease_agreement_files
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAsset:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    asset_id: results.insertId,
                    message: 'Asset created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAsset:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all assets
exports.getAllAssets = (callback) => {
    try {
        const query = `
            SELECT 
                asset_id, asset_name, category, manufacturer_brand, model_number, serial_number,
                location, assigned_user, owning_department, building_facility, floor_room_number,
                gps_coordinates, purchase_date, warranty_expiry, amc_expiry, warranty_period_months,
                installation_date, order_number, supplier_vendor, current_book_value, original_purchase_price,
                asset_type, depreciation_method, invoice_receipt_files, ownership_proof_files,
                insurance_policy_files, lease_agreement_files, created_at
            FROM assets 
            ORDER BY purchase_date DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAllAssets:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    assets: results,
                    message: 'Assets retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAllAssets:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update asset
exports.updateAsset = (asset_id, data, callback) => {
    try {
        const {
            asset_name, category, manufacturer_brand, model_number, serial_number,
            location, assigned_user, owning_department, building_facility, floor_room_number,
            gps_coordinates, purchase_date, warranty_expiry, amc_expiry, warranty_period_months,
            installation_date, order_number, supplier_vendor, current_book_value, original_purchase_price,
            asset_type, depreciation_method, invoice_receipt_files, ownership_proof_files,
            insurance_policy_files, lease_agreement_files
        } = data;

        const query = `
            UPDATE assets SET 
                asset_name = ?, category = ?, manufacturer_brand = ?, model_number = ?, serial_number = ?,
                location = ?, assigned_user = ?, owning_department = ?, building_facility = ?, floor_room_number = ?,
                gps_coordinates = ?, purchase_date = ?, warranty_expiry = ?, amc_expiry = ?, warranty_period_months = ?,
                installation_date = ?, order_number = ?, supplier_vendor = ?, current_book_value = ?, original_purchase_price = ?,
                asset_type = ?, depreciation_method = ?, invoice_receipt_files = ?, ownership_proof_files = ?,
                insurance_policy_files = ?, lease_agreement_files = ?
            WHERE asset_id = ?
        `;
        
        const values = [
            asset_name, category, manufacturer_brand, model_number, serial_number,
            location, assigned_user, owning_department, building_facility, floor_room_number,
            gps_coordinates, purchase_date, warranty_expiry, amc_expiry, warranty_period_months,
            installation_date, order_number, supplier_vendor, current_book_value, original_purchase_price,
            asset_type, depreciation_method, invoice_receipt_files, ownership_proof_files,
            insurance_policy_files, lease_agreement_files, asset_id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAsset:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAsset:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete asset
exports.deleteAsset = (asset_id, callback) => {
    try {
        const query = `DELETE FROM assets WHERE asset_id = ?`;

        getPool().query(query, [asset_id], (error, results) => {
            if (error) {
                console.error('Error in deleteAsset:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAsset:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== PROCURE OPERATIONS ==========

// Create a new indent/procure
exports.createIndent = (data, callback) => {
    try {
        const {
            indent_number, requested_by, requested_date, status, category,
            asset_name, quantity, po_number, supplier_vendor, received_date,
            invoice_details, justification
        } = data;

        const query = `
            INSERT INTO asset_procure (
                indent_number, requested_by, requested_date, status, category,
                asset_name, quantity, po_number, supplier_vendor, received_date,
                invoice_details, justification, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const values = [
            indent_number, requested_by, requested_date, status, category,
            asset_name, quantity, po_number, supplier_vendor, received_date,
            invoice_details, justification
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createIndent:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    indent_id: results.insertId,
                    message: 'Indent created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createIndent:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all indents
exports.getAllIndents = (callback) => {
    try {
        const query = `
            SELECT 
                id, indent_number, requested_by, requested_date, status, category,
                asset_name, quantity, po_number, supplier_vendor, received_date,
                invoice_details, justification, created_at
            FROM asset_procure 
            ORDER BY requested_date DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAllIndents:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    indents: results,
                    message: 'Indents retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAllIndents:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update indent
exports.updateIndent = (id, data, callback) => {
    try {
        const {
            indent_number, requested_by, requested_date, status, category,
            asset_name, quantity, po_number, supplier_vendor, received_date,
            invoice_details, justification
        } = data;

        const query = `
            UPDATE asset_procure SET 
                indent_number = ?, requested_by = ?, requested_date = ?, status = ?, category = ?,
                asset_name = ?, quantity = ?, po_number = ?, supplier_vendor = ?, received_date = ?,
                invoice_details = ?, justification = ?
            WHERE id = ?
        `;
        
        const values = [
            indent_number, requested_by, requested_date, status, category,
            asset_name, quantity, po_number, supplier_vendor, received_date,
            invoice_details, justification, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateIndent:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Indent not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Indent updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateIndent:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete indent
exports.deleteIndent = (id, callback) => {
    try {
        const query = `DELETE FROM asset_procure WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteIndent:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Indent not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Indent deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteIndent:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== ASSET ALLOCATION OPERATIONS ==========

// Create asset allocation
exports.createAssetAllocation = (data, callback) => {
    try {
        const {
            asset_id, assignment_date, assignment_type, return_date,
            assigned_to, assigned_by, assignment_notes, condition_at_issue
        } = data;

        const query = `
            INSERT INTO asset_allocate (
                asset_id, assignment_date, assignment_type, return_date,
                assigned_to, assigned_by, assignment_notes, condition_at_issue, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const values = [
            asset_id, assignment_date, assignment_type, return_date,
            assigned_to, assigned_by, assignment_notes, condition_at_issue
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAssetAllocation:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    allocation_id: results.insertId,
                    message: 'Asset allocation created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAssetAllocation:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all asset allocations
exports.getAllAssetAllocations = (callback) => {
    try {
        const query = `
            SELECT 
                id, asset_id, assignment_date, assignment_type, return_date,
                assigned_to, assigned_by, assignment_notes, condition_at_issue, created_at
            FROM asset_allocate 
            ORDER BY assignment_date DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAllAssetAllocations:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    allocations: results,
                    message: 'Asset allocations retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetAllocations:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get asset allocation by id
exports.getAssetAllocationById = (id, callback) => {
    try {
        const query = `
            SELECT 
                id, asset_id, assignment_date, assignment_type, return_date,
                assigned_to, assigned_by, assignment_notes, condition_at_issue, created_at
            FROM asset_allocate 
            WHERE id = ?
        `;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in getAssetAllocationById:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.length === 0) {
                callback({
                    success: false,
                    message: 'Asset allocation not found'
                });
            } else {
                callback({
                    success: true,
                    allocation: results[0],
                    message: 'Asset allocation retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAssetAllocationById:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update asset allocation
exports.updateAssetAllocation = (id, data, callback) => {
    try {
        const {
            asset_id, assignment_date, assignment_type, return_date,
            assigned_to, assigned_by, assignment_notes, condition_at_issue
        } = data;

        const query = `
            UPDATE asset_allocate SET 
                asset_id = ?, assignment_date = ?, assignment_type = ?, return_date = ?,
                assigned_to = ?, assigned_by = ?, assignment_notes = ?, condition_at_issue = ?
            WHERE id = ?
        `;
        
        const values = [
            asset_id, assignment_date, assignment_type, return_date,
            assigned_to, assigned_by, assignment_notes, condition_at_issue, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAssetAllocation:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset allocation not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset allocation updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAssetAllocation:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete asset allocation
exports.deleteAssetAllocation = (id, callback) => {
    try {
        const query = `DELETE FROM asset_allocate WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteAssetAllocation:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset allocation not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset allocation deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetAllocation:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== ASSET TRANSFER OPERATIONS ==========

// Create asset transfer
exports.createAssetTransfer = (data, callback) => {
    try {
        const {
            transfer_id, asset_id, current_location_or_user, new_location_or_user,
            transfer_date, justification, approver_name
        } = data;

        const query = `
            INSERT INTO asset_transfer (
                transfer_id, asset_id, current_location_or_user, new_location_or_user,
                transfer_date, justification, approver_name, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const values = [
            transfer_id, asset_id, current_location_or_user, new_location_or_user,
            transfer_date, justification, approver_name
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAssetTransfer:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    transfer_id: results.insertId,
                    message: 'Asset transfer created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAssetTransfer:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all asset transfers
exports.getAllAssetTransfers = (callback) => {
    try {
        const query = `
            SELECT 
                id, transfer_id, asset_id, current_location_or_user, new_location_or_user,
                transfer_date, justification, approver_name, created_at
            FROM asset_transfer 
            ORDER BY transfer_date DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAllAssetTransfers:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    transfers: results,
                    message: 'Asset transfers retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetTransfers:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get asset transfer by id
exports.getAssetTransferById = (id, callback) => {
    try {
        const query = `
            SELECT 
                id, transfer_id, asset_id, current_location_or_user, new_location_or_user,
                transfer_date, justification, approver_name, created_at
            FROM asset_transfer 
            WHERE id = ?
        `;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in getAssetTransferById:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.length === 0) {
                callback({
                    success: false,
                    message: 'Asset transfer not found'
                });
            } else {
                callback({
                    success: true,
                    transfer: results[0],
                    message: 'Asset transfer retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAssetTransferById:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update asset transfer
exports.updateAssetTransfer = (id, data, callback) => {
    try {
        const {
            transfer_id, asset_id, current_location_or_user, new_location_or_user,
            transfer_date, justification, approver_name
        } = data;

        const query = `
            UPDATE asset_transfer SET 
                transfer_id = ?, asset_id = ?, current_location_or_user = ?, new_location_or_user = ?,
                transfer_date = ?, justification = ?, approver_name = ?
            WHERE id = ?
        `;
        
        const values = [
            transfer_id, asset_id, current_location_or_user, new_location_or_user,
            transfer_date, justification, approver_name, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAssetTransfer:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset transfer not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset transfer updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAssetTransfer:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete asset transfer
exports.deleteAssetTransfer = (id, callback) => {
    try {
        const query = `DELETE FROM asset_transfer WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteAssetTransfer:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset transfer not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset transfer deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetTransfer:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== ASSET FINANCIAL OPERATIONS ==========

// Create asset financial
exports.createAssetFinancial = (data, callback) => {
    try {
        const {
            asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
            monthly_depreciation, accumulated_depreciation, general_ledger_code
        } = data;

        const query = `
            INSERT INTO asset_financial (
                asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
                monthly_depreciation, accumulated_depreciation, general_ledger_code, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const values = [
            asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
            monthly_depreciation, accumulated_depreciation, general_ledger_code
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAssetFinancial:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    financial_id: results.insertId,
                    message: 'Asset financial record created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAssetFinancial:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all asset financials
exports.getAllAssetFinancials = (callback) => {
    try {
        const query = `
            SELECT 
                id, asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
                monthly_depreciation, accumulated_depreciation, general_ledger_code, created_at
            FROM asset_financial 
            ORDER BY created_at DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAllAssetFinancials:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    financials: results,
                    message: 'Asset financial records retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetFinancials:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get asset financial by id
exports.getAssetFinancialById = (id, callback) => {
    try {
        const query = `
            SELECT 
                id, asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
                monthly_depreciation, accumulated_depreciation, general_ledger_code, created_at
            FROM asset_financial 
            WHERE id = ?
        `;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in getAssetFinancialById:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.length === 0) {
                callback({
                    success: false,
                    message: 'Asset financial record not found'
                });
            } else {
                callback({
                    success: true,
                    financial: results[0],
                    message: 'Asset financial record retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAssetFinancialById:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update asset financial
exports.updateAssetFinancial = (id, data, callback) => {
    try {
        const {
            asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
            monthly_depreciation, accumulated_depreciation, general_ledger_code
        } = data;

        const query = `
            UPDATE asset_financial SET 
                asset_id = ?, depreciation_method = ?, purchase_value = ?, salvage_value = ?, useful_life_years = ?,
                monthly_depreciation = ?, accumulated_depreciation = ?, general_ledger_code = ?
            WHERE id = ?
        `;
        
        const values = [
            asset_id, depreciation_method, purchase_value, salvage_value, useful_life_years,
            monthly_depreciation, accumulated_depreciation, general_ledger_code, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAssetFinancial:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset financial record not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset financial record updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAssetFinancial:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete asset financial
exports.deleteAssetFinancial = (id, callback) => {
    try {
        const query = `DELETE FROM asset_financial WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteAssetFinancial:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset financial record not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset financial record deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetFinancial:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== ASSET DISPOSAL OPERATIONS ==========

// Create asset disposal
exports.createAssetDisposal = (data, callback) => {
    try {
        const {
            asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
            sale_price, book_value, buyer_name
        } = data;

        const query = `
            INSERT INTO asset_disposal (
                asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
                sale_price, book_value, buyer_name, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const values = [
            asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
            sale_price, book_value, buyer_name
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAssetDisposal:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    disposal_id: results.insertId,
                    message: 'Asset disposal record created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAssetDisposal:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all asset disposals
exports.getAllAssetDisposals = (callback) => {
    try {
        const query = `
            SELECT 
                id, asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
                sale_price, book_value, buyer_name, created_at
            FROM asset_disposal 
            ORDER BY disposal_date DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAllAssetDisposals:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    disposals: results,
                    message: 'Asset disposal records retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAllAssetDisposals:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get asset disposal by id
exports.getAssetDisposalById = (id, callback) => {
    try {
        const query = `
            SELECT 
                id, asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
                sale_price, book_value, buyer_name, created_at
            FROM asset_disposal 
            WHERE id = ?
        `;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in getAssetDisposalById:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.length === 0) {
                callback({
                    success: false,
                    message: 'Asset disposal record not found'
                });
            } else {
                callback({
                    success: true,
                    disposal: results[0],
                    message: 'Asset disposal record retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAssetDisposalById:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update asset disposal
exports.updateAssetDisposal = (id, data, callback) => {
    try {
        const {
            asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
            sale_price, book_value, buyer_name
        } = data;

        const query = `
            UPDATE asset_disposal SET 
                asset_code = ?, disposal_type = ?, disposal_date = ?, approver_name = ?, disposal_reason = ?,
                sale_price = ?, book_value = ?, buyer_name = ?
            WHERE id = ?
        `;
        
        const values = [
            asset_code, disposal_type, disposal_date, approver_name, disposal_reason,
            sale_price, book_value, buyer_name, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAssetDisposal:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset disposal record not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset disposal record updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAssetDisposal:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete asset disposal
exports.deleteAssetDisposal = (id, callback) => {
    try {
        const query = `DELETE FROM asset_disposal WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteAssetDisposal:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Asset disposal record not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Asset disposal record deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAssetDisposal:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};