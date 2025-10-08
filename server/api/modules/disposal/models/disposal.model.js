const { getPool } = require('../../../../../config/db.config');

class DisposalModel {
    constructor() {
        console.log('DisposalModel initialized');
    }

    // ========== DISPOSAL OPERATIONS ==========

    // Create a new disposal record
    createDisposal(data, callback) {
        try {
            const {
                id, asset_id, asset_name, disposal_date, reason, method, status, remarks
            } = data;

            const query = `
                INSERT INTO disposal_report (
                    id, asset_id, asset_name, disposal_date, reason, method, status, remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                id, asset_id, asset_name, disposal_date, reason, method, status, remarks
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in createDisposal:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        disposal_id: results.insertId,
                        message: 'Disposal record created successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in createDisposal:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get all disposal records
    getAllDisposals(callback) {
        try {
            const query = `
                SELECT 
                    id, asset_id, asset_name, disposal_date, reason, method, status, remarks
                FROM disposal_report 
                ORDER BY disposal_date DESC
            `;

            getPool().query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllDisposals:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        disposals: results,
                        message: 'Disposal records retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getAllDisposals:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Update disposal record
    updateDisposal(id, data, callback) {
        try {
            const {
                asset_id, asset_name, disposal_date, reason, method, status, remarks
            } = data;

            const query = `
                UPDATE disposal_report SET 
                    asset_id = ?, asset_name = ?, disposal_date = ?, reason = ?, method = ?, status = ?, remarks = ?
                WHERE id = ?
            `;

            const values = [
                asset_id, asset_name, disposal_date, reason, method, status, remarks, id
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in updateDisposal:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Disposal record not found or no changes made'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Disposal record updated successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in updateDisposal:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Delete disposal record
    deleteDisposal(id, callback) {
        try {
            const query = `DELETE FROM disposal_report WHERE id = ?`;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in deleteDisposal:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Disposal record not found'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Disposal record deleted successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in deleteDisposal:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }
}

module.exports = new DisposalModel();
