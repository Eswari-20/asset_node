const DisposalModel = require('../models/disposal.model');

class DisposalController {
    constructor() {
        console.log('DisposalController initialized');
    }

    // ========== DISPOSAL CONTROLLERS ==========

    // Create new disposal record
    createDisposal(req, res) {
        try {
            const {
                id, asset_id, asset_name, disposal_date, reason, method, status, remarks
            } = req.body;

            // Validate required fields
            if (!id || !asset_id || !asset_name || !disposal_date || !reason || !method || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'id, asset_id, asset_name, disposal_date, reason, method, and status are required'
                });
            }

            DisposalModel.createDisposal(req.body, (result) => {
                if (result.success) {
                    res.status(201).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in createDisposal controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get all disposal records
    getAllDisposals(req, res) {
        try {
            DisposalModel.getAllDisposals((result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getAllDisposals controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Update disposal record
    updateDisposal(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            DisposalModel.updateDisposal(id, req.body, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Disposal record not found or no changes made') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in updateDisposal controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Delete disposal record
    deleteDisposal(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            DisposalModel.deleteDisposal(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Disposal record not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in deleteDisposal controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }
}

module.exports = new DisposalController();
