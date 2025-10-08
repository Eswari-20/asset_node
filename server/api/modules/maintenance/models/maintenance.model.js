const { getPool } = require('../../../../../config/db.config');

class MaintenanceModel {
    constructor() {
        console.log('MaintenanceModel initialized');
    }

    // ========== MAINTENANCE REQUESTS OPERATIONS ==========

    // Create a new maintenance request
    createMaintenanceRequest(data, callback) {
        try {
            const {
                maintenance_id, asset, type, scheduled_date, due_date, status, priority, assigned_to
            } = data;

            const query = `
                INSERT INTO maintenance_requests (
                    maintenance_id, asset, type, scheduled_date, due_date, status, priority, assigned_to
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                maintenance_id, asset, type, scheduled_date, due_date, status, priority, assigned_to
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in createMaintenanceRequest:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        maintenance_id: maintenance_id,
                        message: 'Maintenance request created successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in createMaintenanceRequest:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get all maintenance requests
    getAllMaintenanceRequests(callback) {
        try {
            const query = `
                SELECT 
                    maintenance_id, asset, type, scheduled_date, due_date, status, priority, assigned_to
                FROM maintenance_requests 
                ORDER BY scheduled_date DESC
            `;

            getPool().query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllMaintenanceRequests:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        maintenance_requests: results,
                        message: 'Maintenance requests retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getAllMaintenanceRequests:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get maintenance request by ID
    getMaintenanceRequestById(maintenance_id, callback) {
        try {
            const query = `
                SELECT 
                    maintenance_id, asset, type, scheduled_date, due_date, status, priority, assigned_to
                FROM maintenance_requests 
                WHERE maintenance_id = ?
            `;

            getPool().query(query, [maintenance_id], (error, results) => {
                if (error) {
                    console.error('Error in getMaintenanceRequestById:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.length === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance request not found'
                    });
                } else {
                    callback({
                        success: true,
                        maintenance_request: results[0],
                        message: 'Maintenance request retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getMaintenanceRequestById:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Update maintenance request
    updateMaintenanceRequest(maintenance_id, data, callback) {
        try {
            const {
                asset, type, scheduled_date, due_date, status, priority, assigned_to
            } = data;

            const query = `
                UPDATE maintenance_requests SET 
                    asset = ?, type = ?, scheduled_date = ?, due_date = ?, status = ?, priority = ?, assigned_to = ?
                WHERE maintenance_id = ?
            `;

            const values = [
                asset, type, scheduled_date, due_date, status, priority, assigned_to, maintenance_id
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in updateMaintenanceRequest:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance request not found or no changes made'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Maintenance request updated successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in updateMaintenanceRequest:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Delete maintenance request
    deleteMaintenanceRequest(maintenance_id, callback) {
        try {
            const query = `DELETE FROM maintenance_requests WHERE maintenance_id = ?`;

            getPool().query(query, [maintenance_id], (error, results) => {
                if (error) {
                    console.error('Error in deleteMaintenanceRequest:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance request not found'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Maintenance request deleted successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in deleteMaintenanceRequest:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // ========== SERVICE CALL LOG OPERATIONS ==========

    // Create a new service call log
    createServiceCallLog(data, callback) {
        try {
            const {
                asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                cost_incurred, downtime_hours, service_notes, attachment, status
            } = data;

            const query = `
                INSERT INTO service_call_log (
                    asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                    cost_incurred, downtime_hours, service_notes, attachment, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Convert status to 1 for active records
            const statusValue = (status === "Active" || status === "active" || status === 1) ? 1 : 1; // Default to active

            const values = [
                asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                cost_incurred, downtime_hours, service_notes, attachment, statusValue
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in createServiceCallLog:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        service_log_id: results.insertId,
                        message: 'Service call log created successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in createServiceCallLog:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get all service call logs
    getAllServiceCallLogs(callback) {
        try {
            const query = `
                SELECT 
                    id, asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                    cost_incurred, downtime_hours, service_notes, attachment
                FROM service_call_log 
                WHERE status = 1
                ORDER BY service_date DESC
            `;

            getPool().query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllServiceCallLogs:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        service_logs: results,
                        message: 'Service call logs retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getAllServiceCallLogs:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get service call log by ID
    getServiceCallLogById(id, callback) {
        try {
            const query = `
                SELECT 
                    id, asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                    cost_incurred, downtime_hours, service_notes, attachment
                FROM service_call_log 
                WHERE id = ? AND status = 1
            `;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in getServiceCallLogById:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.length === 0) {
                    callback({
                        success: false,
                        message: 'Service call log not found'
                    });
                } else {
                    callback({
                        success: true,
                        service_log: results[0],
                        message: 'Service call log retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getServiceCallLogById:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Update service call log
    updateServiceCallLog(id, data, callback) {
        try {
            const {
                asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                cost_incurred, downtime_hours, service_notes, attachment, status
            } = data;

            const query = `
                UPDATE service_call_log SET 
                    asset_id = ?, maintenance_type = ?, service_date = ?, next_scheduled_date = ?, vendor_technician = ?,
                    cost_incurred = ?, downtime_hours = ?, service_notes = ?, attachment = ?, status = ?
                WHERE id = ?
            `;

            // Convert status to 1 for active records
            const statusValue = (status === "Active" || status === "active" || status === 1) ? 1 : 0;

            const values = [
                asset_id, maintenance_type, service_date, next_scheduled_date, vendor_technician,
                cost_incurred, downtime_hours, service_notes, attachment, statusValue, id
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in updateServiceCallLog:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Service call log not found or no changes made'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Service call log updated successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in updateServiceCallLog:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Delete service call log
    deleteServiceCallLog(id, callback) {
        try {
            const query = `DELETE FROM service_call_log WHERE id = ?`;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in deleteServiceCallLog:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Service call log not found'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Service call log deleted successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in deleteServiceCallLog:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // ========== MAINTENANCE SCHEDULE OPERATIONS ==========

    // Create a new maintenance schedule
    createMaintenanceSchedule(data, callback) {
        try {
            const {
                asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                location, estimated_cost, vendor, notification, attachment, status
            } = data;

            const query = `
                INSERT INTO maintenance_schedule (
                    asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                    location, estimated_cost, vendor, notification, attachment, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Convert status to 1 for active records
            const statusValue = (status === "Active" || status === "active" || status === 1) ? 1 : 1; // Default to active

            const values = [
                asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                location, estimated_cost, vendor, notification, attachment, statusValue
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in createMaintenanceSchedule:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        schedule_id: results.insertId,
                        message: 'Maintenance schedule created successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in createMaintenanceSchedule:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get all maintenance schedules
    getAllMaintenanceSchedules(callback) {
        try {
            const query = `
                SELECT 
                    id, asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                    location, estimated_cost, vendor, notification, attachment
                FROM maintenance_schedule 
                WHERE status = 1
                ORDER BY scheduled_date DESC
            `;

            getPool().query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllMaintenanceSchedules:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        schedules: results,
                        message: 'Maintenance schedules retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getAllMaintenanceSchedules:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get maintenance schedule by ID
    getMaintenanceScheduleById(id, callback) {
        try {
            const query = `
                SELECT 
                    id, asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                    location, estimated_cost, vendor, notification, attachment
                FROM maintenance_schedule 
                WHERE id = ? AND status = 1
            `;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in getMaintenanceScheduleById:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.length === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance schedule not found'
                    });
                } else {
                    callback({
                        success: true,
                        schedule: results[0],
                        message: 'Maintenance schedule retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getMaintenanceScheduleById:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Update maintenance schedule
    updateMaintenanceSchedule(id, data, callback) {
        try {
            const {
                asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                location, estimated_cost, vendor, notification, attachment, status
            } = data;

            const query = `
                UPDATE maintenance_schedule SET 
                    asset_id = ?, maintenance_type = ?, description = ?, scheduled_date = ?, due_date = ?, priority = ?, assigned_to = ?,
                    location = ?, estimated_cost = ?, vendor = ?, notification = ?, attachment = ?, status = ?
                WHERE id = ?
            `;

            // Convert status to 1 for active records
            const statusValue = (status === "Active" || status === "active" || status === 1) ? 1 : 0;

            const values = [
                asset_id, maintenance_type, description, scheduled_date, due_date, priority, assigned_to,
                location, estimated_cost, vendor, notification, attachment, statusValue, id
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in updateMaintenanceSchedule:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance schedule not found or no changes made'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Maintenance schedule updated successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in updateMaintenanceSchedule:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Delete maintenance schedule
    deleteMaintenanceSchedule(id, callback) {
        try {
            const query = `DELETE FROM maintenance_schedule WHERE id = ?`;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in deleteMaintenanceSchedule:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance schedule not found'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Maintenance schedule deleted successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in deleteMaintenanceSchedule:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // ========== MAINTENANCE HISTORY OPERATIONS ==========

    // Create a new maintenance history
    createMaintenanceHistory(data, callback) {
        try {
            const {
                asset_id, type, status, date_from, date_to
            } = data;

            const query = `
                INSERT INTO maintenance_history (
                    asset_id, type, status, date_from, date_to
                ) VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                asset_id, type, 1, date_from, date_to
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in createMaintenanceHistory:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        history_id: results.insertId,
                        message: 'Maintenance history created successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in createMaintenanceHistory:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get all maintenance history
    getAllMaintenanceHistory(callback) {
        try {
            const query = `
                SELECT 
                    id, asset_id, type, status, date_from, date_to, created_at
                FROM maintenance_history 
                ORDER BY created_at DESC
            `;

            getPool().query(query, (error, results) => {
                if (error) {
                    console.error('Error in getAllMaintenanceHistory:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else {
                    callback({
                        success: true,
                        history: results,
                        message: 'Maintenance history retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getAllMaintenanceHistory:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Get maintenance history by ID
    getMaintenanceHistoryById(id, callback) {
        try {
            const query = `
                SELECT 
                    id, asset_id, type, status, date_from, date_to, created_at
                FROM maintenance_history 
                WHERE id = ?
            `;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in getMaintenanceHistoryById:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.length === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance history not found'
                    });
                } else {
                    callback({
                        success: true,
                        history: results[0],
                        message: 'Maintenance history retrieved successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in getMaintenanceHistoryById:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Update maintenance history
    updateMaintenanceHistory(id, data, callback) {
        try {
            const {
                asset_id, type, status, date_from, date_to
            } = data;

            const query = `
                UPDATE maintenance_history SET 
                    asset_id = ?, type = ?, status = ?, date_from = ?, date_to = ?
                WHERE id = ?
            `;

            const values = [
                asset_id, type, 1, date_from, date_to, id
            ];

            getPool().query(query, values, (error, results) => {
                if (error) {
                    console.error('Error in updateMaintenanceHistory:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance history not found or no changes made'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Maintenance history updated successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in updateMaintenanceHistory:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }

    // Delete maintenance history
    deleteMaintenanceHistory(id, callback) {
        try {
            const query = `DELETE FROM maintenance_history WHERE id = ?`;

            getPool().query(query, [id], (error, results) => {
                if (error) {
                    console.error('Error in deleteMaintenanceHistory:', error);
                    callback({
                        success: false,
                        message: 'Database error',
                        details: error.message
                    });
                } else if (results.affectedRows === 0) {
                    callback({
                        success: false,
                        message: 'Maintenance history not found'
                    });
                } else {
                    callback({
                        success: true,
                        message: 'Maintenance history deleted successfully'
                    });
                }
            });
        } catch (error) {
            console.error('Error in deleteMaintenanceHistory:', error);
            callback({
                success: false,
                message: 'Database error',
                details: error.message
            });
        }
    }
}

module.exports = new MaintenanceModel();
