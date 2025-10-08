const MaintenanceModel = require('../models/maintenance.model');

class MaintenanceController {
    constructor() {
        console.log('MaintenanceController initialized');
    }

    // ========== MAINTENANCE REQUESTS CONTROLLERS ==========

    // Create new maintenance request
    createMaintenanceRequest(req, res) {
        try {
            const {
                maintenance_id, asset, type, scheduled_date, due_date, status, priority, assigned_to
            } = req.body;

            // Validate required fields
            if (!maintenance_id || !asset || !type || !scheduled_date || !due_date || !status || !priority || !assigned_to) {
                return res.status(400).json({
                    success: false,
                    message: 'maintenance_id, asset, type, scheduled_date, due_date, status, priority, and assigned_to are required'
                });
            }

            MaintenanceModel.createMaintenanceRequest(req.body, (result) => {
                if (result.success) {
                    res.status(201).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in createMaintenanceRequest controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get all maintenance requests
    getAllMaintenanceRequests(req, res) {
        try {
            MaintenanceModel.getAllMaintenanceRequests((result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getAllMaintenanceRequests controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get maintenance request by ID
    getMaintenanceRequestById(req, res) {
        try {
            const { maintenance_id } = req.body;
            
            if (!maintenance_id) {
                return res.status(400).json({
                    success: false,
                    message: 'maintenance_id is required in request body'
                });
            }

            MaintenanceModel.getMaintenanceRequestById(maintenance_id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance request not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getMaintenanceRequestById controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Update maintenance request
    updateMaintenanceRequest(req, res) {
        try {
            const { maintenance_id } = req.body;
            
            if (!maintenance_id) {
                return res.status(400).json({
                    success: false,
                    message: 'maintenance_id is required in request body'
                });
            }

            MaintenanceModel.updateMaintenanceRequest(maintenance_id, req.body, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance request not found or no changes made') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in updateMaintenanceRequest controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Delete maintenance request
    deleteMaintenanceRequest(req, res) {
        try {
            const { maintenance_id } = req.body;
            
            if (!maintenance_id) {
                return res.status(400).json({
                    success: false,
                    message: 'maintenance_id is required in request body'
                });
            }

            MaintenanceModel.deleteMaintenanceRequest(maintenance_id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance request not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in deleteMaintenanceRequest controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // ========== SERVICE CALL LOG CONTROLLERS ==========

    // Create new service call log
    createServiceCallLog(req, res) {
        try {
            const {
                asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                cost_incurred, downtime_hours, service_notes, attachment
            } = req.body;

            // Validate required fields
            if (!asset_id || !maintenance_type || !service_date || !vendor_technician) {
                return res.status(400).json({
                    success: false,
                    message: 'asset_id, maintenance_type, service_date, and vendor_technician are required'
                });
            }

            MaintenanceModel.createServiceCallLog(req.body, (result) => {
                if (result.success) {
                    res.status(201).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in createServiceCallLog controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get all service call logs
    getAllServiceCallLogs(req, res) {
        try {
            MaintenanceModel.getAllServiceCallLogs((result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getAllServiceCallLogs controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get service call log by ID
    getServiceCallLogById(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.getServiceCallLogById(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Service call log not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getServiceCallLogById controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Update service call log
    updateServiceCallLog(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.updateServiceCallLog(id, req.body, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Service call log not found or no changes made') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in updateServiceCallLog controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Delete service call log
    deleteServiceCallLog(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.deleteServiceCallLog(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Service call log not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in deleteServiceCallLog controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // ========== MAINTENANCE SCHEDULE CONTROLLERS ==========

    // Create new maintenance schedule
    createMaintenanceSchedule(req, res) {
        try {
            const {
                asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                location, estimated_cost, vendor, notification, attachment
            } = req.body;

            // Validate required fields
            if (!asset_id || !maintenance_type || !description || !scheduled_date || !due_date || !priority || !assigned_to) {
                return res.status(400).json({
                    success: false,
                    message: 'asset_id, maintenance_type, description, scheduled_date, due_date, priority, and assigned_to are required'
                });
            }

            MaintenanceModel.createMaintenanceSchedule(req.body, (result) => {
                if (result.success) {
                    res.status(201).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in createMaintenanceSchedule controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get all maintenance schedules
    getAllMaintenanceSchedules(req, res) {
        try {
            MaintenanceModel.getAllMaintenanceSchedules((result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getAllMaintenanceSchedules controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get maintenance schedule by ID
    getMaintenanceScheduleById(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.getMaintenanceScheduleById(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance schedule not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getMaintenanceScheduleById controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Update maintenance schedule
    updateMaintenanceSchedule(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.updateMaintenanceSchedule(id, req.body, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance schedule not found or no changes made') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in updateMaintenanceSchedule controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Delete maintenance schedule
    deleteMaintenanceSchedule(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.deleteMaintenanceSchedule(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance schedule not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in deleteMaintenanceSchedule controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // ========== MAINTENANCE HISTORY CONTROLLERS ==========

    // Create new maintenance history
    createMaintenanceHistory(req, res) {
        try {
            const {
                asset_id, type, date_from, date_to
            } = req.body;

            // Validate required fields
            if (!asset_id || !type || !date_from || !date_to) {
                return res.status(400).json({
                    success: false,
                    message: 'asset_id, type, date_from, and date_to are required'
                });
            }

            MaintenanceModel.createMaintenanceHistory(req.body, (result) => {
                if (result.success) {
                    res.status(201).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in createMaintenanceHistory controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get all maintenance history
    getAllMaintenanceHistory(req, res) {
        try {
            MaintenanceModel.getAllMaintenanceHistory((result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getAllMaintenanceHistory controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Get maintenance history by ID
    getMaintenanceHistoryById(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.getMaintenanceHistoryById(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance history not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in getMaintenanceHistoryById controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Update maintenance history
    updateMaintenanceHistory(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.updateMaintenanceHistory(id, req.body, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance history not found or no changes made') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in updateMaintenanceHistory controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }

    // Delete maintenance history
    deleteMaintenanceHistory(req, res) {
        try {
            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'id is required in request body'
                });
            }

            MaintenanceModel.deleteMaintenanceHistory(id, (result) => {
                if (result.success) {
                    res.status(200).json(result);
                } else if (result.message === 'Maintenance history not found') {
                    res.status(404).json(result);
                } else {
                    res.status(500).json(result);
                }
            });
        } catch (error) {
            console.error('Error in deleteMaintenanceHistory controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                details: error.message
            });
        }
    }
}

module.exports = new MaintenanceController();
