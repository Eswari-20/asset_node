const sqldb = require("../../../../../config/db.config");
const dbutil = require('../../../../../utils/db.utils');
const df = require('../../../../../utils/dflower.utils');
const cntxtDtls = df.getModuleMetaData(__dirname, __filename);
const util = require('util');
const execQuery = util.promisify(sqldb.query).bind(sqldb);
const { getPool } = require("../../../../../config/db.config");

// ---------------------- Helper to wrap callback-based execParamsQuery ----------------------
const execParamsQueryAsync = (pool, query, params = [], cntxt = {}) => {
    return new Promise((resolve, reject) => {
        dbutil.execParamsQuery(pool, query, params, cntxt, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// ========== COMPLIANCE OPERATIONS ==========

// Create a new compliance record
exports.createComplianceMdl = (data, callback) => {
    try {
        const {
            policy_id, policy_name, compliance_type, status, asset_category, due_date_from, due_date_to
        } = data;

        const query = `
            INSERT INTO compliance (
                policy_id, policy_name, compliance_type, status, asset_category, due_date_from, due_date_to, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            policy_id, policy_name, compliance_type, status, asset_category, due_date_from, due_date_to
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createComplianceMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    compliance_id: results.insertId,
                    message: 'Compliance record created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createComplianceMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all compliance records
exports.getCompliancesListMdl = (callback) => {
    try {
        const query = `
            SELECT 
                id, policy_id, policy_name, compliance_type, status, asset_category, due_date_from, due_date_to, created_at
            FROM compliance 
            ORDER BY created_at DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getCompliancesListMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    compliances: results,
                    message: 'Compliance records retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getCompliancesListMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update compliance record
exports.updateComplianceMdl = (id, data, callback) => {
    try {
        const {
            policy_id, policy_name, compliance_type, status, asset_category, due_date_from, due_date_to
        } = data;

        const query = `
            UPDATE compliance SET 
                policy_id = ?, policy_name = ?, compliance_type = ?, status = ?, asset_category = ?, due_date_from = ?, due_date_to = ?
            WHERE id = ?
        `;

        const values = [
            policy_id, policy_name, compliance_type, status, asset_category, due_date_from, due_date_to, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateComplianceMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Compliance record not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Compliance record updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateComplianceMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete compliance record
exports.deleteComplianceMdl = (id, callback) => {
    try {
        const query = `DELETE FROM compliance WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteComplianceMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Compliance record not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Compliance record deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteComplianceMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== AUDIT OPERATIONS ==========

// Create a new audit record
exports.createAuditMdl = (data, callback) => {
    try {
        const {
            audit_title, policy_id, audit_type, assigned_to, due_date, scope, description
        } = data;

        const query = `
            INSERT INTO new_audit (
                audit_title, policy_id, audit_type, assigned_to, due_date, scope, description, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            audit_title, policy_id, audit_type, assigned_to, due_date, scope, description
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAuditMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    audit_id: results.insertId,
                    message: 'Audit record created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAuditMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all audit records
exports.getAuditsListMdl = (callback) => {
    try {
        const query = `
            SELECT 
                id, audit_title, policy_id, audit_type, assigned_to, due_date, scope, description, created_at
            FROM new_audit 
            ORDER BY created_at DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAuditsListMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    audits: results,
                    message: 'Audit records retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAuditsListMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update audit record
exports.updateAuditMdl = (id, data, callback) => {
    try {
        const {
            audit_title, policy_id, audit_type, assigned_to, due_date, scope, description
        } = data;

        const query = `
            UPDATE new_audit SET 
                audit_title = ?, policy_id = ?, audit_type = ?, assigned_to = ?, due_date = ?, scope = ?, description = ?
            WHERE id = ?
        `;

        const values = [
            audit_title, policy_id, audit_type, assigned_to, due_date, scope, description, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAuditMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Audit record not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Audit record updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAuditMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete audit record
exports.deleteAuditMdl = (id, callback) => {
    try {
        const query = `DELETE FROM new_audit WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteAuditMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Audit record not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Audit record deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAuditMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== AUDIT PLAN OPERATIONS ==========

// Create a new audit plan record
exports.createAuditPlanMdl = (data, callback) => {
    try {
        const {
            audit_title, policy_id, audit_type, scope, start_date, due_date, description
        } = data;

        const query = `
            INSERT INTO audit_plan (
                audit_title, policy_id, audit_type, scope, start_date, due_date, description, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            audit_title, policy_id, audit_type, scope, start_date, due_date, description
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAuditPlanMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    audit_plan_id: results.insertId,
                    message: 'Audit plan record created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAuditPlanMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all audit plan records
exports.getAuditPlansListMdl = (callback) => {
    try {
        const query = `
            SELECT 
                id, audit_title, policy_id, audit_type, scope, start_date, due_date, description, created_at
            FROM audit_plan 
            ORDER BY created_at DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAuditPlansListMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    audit_plans: results,
                    message: 'Audit plan records retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAuditPlansListMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update audit plan record
exports.updateAuditPlanMdl = (id, data, callback) => {
    try {
        const {
            audit_title, policy_id, audit_type, scope, start_date, due_date, description
        } = data;

        const query = `
            UPDATE audit_plan SET 
                audit_title = ?, policy_id = ?, audit_type = ?, scope = ?, start_date = ?, due_date = ?, description = ?
            WHERE id = ?
        `;

        const values = [
            audit_title, policy_id, audit_type, scope, start_date, due_date, description, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAuditPlanMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Audit plan record not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Audit plan record updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAuditPlanMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete audit plan record
exports.deleteAuditPlanMdl = (id, callback) => {
    try {
        const query = `DELETE FROM audit_plan WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteAuditPlanMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Audit plan record not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Audit plan record deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAuditPlanMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// ========== ASSIGN TEAM OPERATIONS ==========

// Create a new assign team record
exports.createAssignTeamMdl = (data, callback) => {
    try {
        const {
            audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, assignment_notes
        } = data;

        const query = `
            INSERT INTO assign_team (
                audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, assignment_notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, assignment_notes
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in createAssignTeamMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    assign_team_id: results.insertId,
                    message: 'Assign team record created successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in createAssignTeamMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Get all assign team records
exports.getAssignTeamsListMdl = (callback) => {
    try {
        const query = `
            SELECT 
                id, audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, assignment_notes, created_at
            FROM assign_team 
            ORDER BY created_at DESC
        `;

        getPool().query(query, (error, results) => {
            if (error) {
                console.error('Error in getAssignTeamsListMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else {
                callback({
                    success: true,
                    assign_teams: results,
                    message: 'Assign team records retrieved successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in getAssignTeamsListMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Update assign team record
exports.updateAssignTeamMdl = (id, data, callback) => {
    try {
        const {
            audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, assignment_notes
        } = data;

        const query = `
            UPDATE assign_team SET 
                audit_title = ?, policy_manager = ?, scope_members = ?, lead_auditor = ?, reviewer = ?, evidence_approver = ?, site_coordinators = ?, observers = ?, due_reminder = ?, assignment_notes = ?
            WHERE id = ?
        `;

        const values = [
            audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, assignment_notes, id
        ];

        getPool().query(query, values, (error, results) => {
            if (error) {
                console.error('Error in updateAssignTeamMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Assign team record not found or no changes made'
                });
            } else {
                callback({
                    success: true,
                    message: 'Assign team record updated successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in updateAssignTeamMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};

// Delete assign team record
exports.deleteAssignTeamMdl = (id, callback) => {
    try {
        const query = `DELETE FROM assign_team WHERE id = ?`;

        getPool().query(query, [id], (error, results) => {
            if (error) {
                console.error('Error in deleteAssignTeamMdl:', error);
                callback({
                    success: false,
                    message: 'Database error',
                    details: error.message
                });
            } else if (results.affectedRows === 0) {
                callback({
                    success: false,
                    message: 'Assign team record not found'
                });
            } else {
                callback({
                    success: true,
                    message: 'Assign team record deleted successfully'
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteAssignTeamMdl:', error);
        callback({
            success: false,
            message: 'Database error',
            details: error.message
        });
    }
};
