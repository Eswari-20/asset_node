const { getPool } = require('../../../../../config/db.config');

class FinancialsModel {
    constructor() {
        console.log('FinancialsModel initialized');
    }

    // ========== FINANCIALS OPERATIONS ==========

    // Create a new financial record
    createFinancial(data, callback) {
        try {
            const {
                id, asset_category, cost_center, location, acquisition_date, 
                financial_year, amount, currency, vendor_name, remarks
            } = data;

            const query = `
                INSERT INTO financials (
                    id, asset_category, cost_center, location, acquisition_date, 
                    financial_year, amount, currency, vendor_name, remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                id, asset_category, cost_center, location, acquisition_date, 
                financial_year, amount, currency, vendor_name, remarks
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in createFinancial:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        financial_id: results.insertId,
                        message: 'Financial record created successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in createFinancial:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get all financial records
    getAllFinancials(callback) {
        try {
            const query = `
                SELECT 
                    id, asset_category, cost_center, location, acquisition_date, 
                    financial_year, amount, currency, vendor_name, remarks
                FROM financials 
                ORDER BY acquisition_date DESC
            `;

            getPool().query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllFinancials:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        financials: results,
                        message: 'Financial records retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getAllFinancials:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }


    // Update financial record
    updateFinancial(id, data, callback) {
        try {
            const {
                asset_category, cost_center, location, acquisition_date, 
                financial_year, amount, currency, vendor_name, remarks
            } = data;

            const query = `
                UPDATE financials SET 
                    asset_category = ?, cost_center = ?, location = ?, acquisition_date = ?, 
                    financial_year = ?, amount = ?, currency = ?, vendor_name = ?, remarks = ?
                WHERE id = ?
            `;

            const values = [
                asset_category, cost_center, location, acquisition_date, 
                financial_year, amount, currency, vendor_name, remarks, id
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in updateFinancial:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Financial record not found or no changes made'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Financial record updated successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in updateFinancial:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Delete financial record
    deleteFinancial(id, callback) {
        try {
            const query = `DELETE FROM financials WHERE id = ?`;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in deleteFinancial:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Financial record not found'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Financial record deleted successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in deleteFinancial:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }
}

module.exports = new FinancialsModel();
