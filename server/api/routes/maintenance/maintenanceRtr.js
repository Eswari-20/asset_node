const express = require('express');
const router = express.Router();
const MaintenanceController = require('../../modules/maintenance/controllers/maintenance.controller');

console.log('🔧 Loading maintenance routes...');

// ========== MAINTENANCE REQUESTS ROUTES ==========
router.post('/', MaintenanceController.createMaintenanceRequest);     // Create maintenance request
router.get('/', MaintenanceController.getAllMaintenanceRequests);      // Get all maintenance requests
router.put('/', MaintenanceController.updateMaintenanceRequest);       // Update maintenance request
router.delete('/', MaintenanceController.deleteMaintenanceRequest);     // Delete maintenance request

// ========== SERVICE CALL LOG ROUTES ==========
router.post('/service-log', MaintenanceController.createServiceCallLog);     // Create service call log
router.get('/service-log', MaintenanceController.getAllServiceCallLogs);      // Get all service call logs
router.put('/service-log', MaintenanceController.updateServiceCallLog);       // Update service call log
router.delete('/service-log', MaintenanceController.deleteServiceCallLog);     // Delete service call log

// ========== MAINTENANCE SCHEDULE ROUTES ==========
router.post('/schedule', MaintenanceController.createMaintenanceSchedule);     // Create maintenance schedule
router.get('/schedule', MaintenanceController.getAllMaintenanceSchedules);      // Get all maintenance schedules
router.put('/schedule', MaintenanceController.updateMaintenanceSchedule);       // Update maintenance schedule
router.delete('/schedule', MaintenanceController.deleteMaintenanceSchedule);     // Delete maintenance schedule

// ========== MAINTENANCE HISTORY ROUTES ==========
router.post('/history', MaintenanceController.createMaintenanceHistory);     // Create maintenance history
router.get('/history', MaintenanceController.getAllMaintenanceHistory);      // Get all maintenance history
router.put('/history', MaintenanceController.updateMaintenanceHistory);       // Update maintenance history
router.delete('/history', MaintenanceController.deleteMaintenanceHistory);     // Delete maintenance history

console.log('✅ Maintenance routes loaded');

module.exports = router;
