const FinancialsModel = require('../models/financials.model');

class FinancialsController {
    constructor() {
        console.log('FinancialsController initialized');
    }

    // ========== FINANCIALS CONTROLLERS ==========

    // Create new financial record
    createFinancial(req, res) {
        try {
            const {
                id, asset_category, cost_center, location, acquisition_date, 
                financial_year, amount, currency, vendor_name, remarks
            } = req.body;

            // Validate required fields
            if (!asset_category || !cost_center || !location || !acquisition_date || 
                !financial_year || !amount || !currency || !vendor_name) {
                return res.status(400).json({
                    success: false,
                    message: 'asset_category, cost_center, location, acquisition_date, financial_year, amount, currency, and vendor_name are required'
                });
            }

            FinancialsModel.createFinancial(req.body, (result) => {
                if (result.success) {
                    res.status(201).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in createFinancial controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get all financial records
    getAllFinancials(req, res) {
        try {
            FinancialsModel.getAllFinancials((result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getAllFinancials controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }


    // Update financial record
    updateFinancial(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            FinancialsModel.updateFinancial(id, req.body, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Financial record not found or no changes made') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in updateFinancial controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Delete financial record
    deleteFinancial(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            FinancialsModel.deleteFinancial(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Financial record not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in deleteFinancial controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }
}

module.exports = new FinancialsController();
