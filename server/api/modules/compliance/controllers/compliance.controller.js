const ComplianceModel = require('../models/compliance.model');

// ========== COMPLIANCE CONTROLLERS ==========

// Create new compliance record
exports.createComplianceCtrl = (req, res) => {
    try {
        const {
            policy_id, policy_name, compliance_type, status, asset_category, due_date_from, due_date_to
        } = req.body;

        // Validate required fields
        if (!policy_id || !policy_name || !compliance_type || !status || !asset_category || !due_date_from || !due_date_to) {
            return res.status(400).json({
                success: false,
                message: 'policy_id, policy_name, compliance_type, status, asset_category, due_date_from, and due_date_to are required'
            });
        }

        ComplianceModel.createComplianceMdl(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createComplianceCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all compliance records
exports.getCompliancesListCtrl = (req, res) => {
    try {
        ComplianceModel.getCompliancesListMdl((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getCompliancesListCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update compliance record
exports.updateComplianceCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.updateComplianceMdl(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Compliance record not found or no changes made') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateComplianceCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete compliance record
exports.deleteComplianceCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.deleteComplianceMdl(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Compliance record not found') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteComplianceCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== AUDIT CONTROLLERS ==========

// Create new audit record
exports.createAuditCtrl = (req, res) => {
    try {
        const {
            audit_title, policy_id, audit_type, assigned_to, due_date, scope, description
        } = req.body;

        // Validate required fields
        if (!audit_title || !policy_id || !audit_type || !assigned_to || !due_date || !scope || !description) {
            return res.status(400).json({
                success: false,
                message: 'audit_title, policy_id, audit_type, assigned_to, due_date, scope, and description are required'
            });
        }

        ComplianceModel.createAuditMdl(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAuditCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all audit records
exports.getAuditsListCtrl = (req, res) => {
    try {
        ComplianceModel.getAuditsListMdl((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAuditsListCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update audit record
exports.updateAuditCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.updateAuditMdl(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Audit record not found or no changes made') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAuditCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete audit record
exports.deleteAuditCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.deleteAuditMdl(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Audit record not found') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAuditCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== AUDIT PLAN CONTROLLERS ==========

// Create new audit plan record
exports.createAuditPlanCtrl = (req, res) => {
    try {
        const {
            audit_title, policy_id, audit_type, scope, start_date, due_date, description
        } = req.body;

        // Validate required fields
        if (!audit_title || !policy_id || !audit_type || !scope || !start_date || !due_date || !description) {
            return res.status(400).json({
                success: false,
                message: 'audit_title, policy_id, audit_type, scope, start_date, due_date, and description are required'
            });
        }

        ComplianceModel.createAuditPlanMdl(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAuditPlanCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all audit plan records
exports.getAuditPlansListCtrl = (req, res) => {
    try {
        ComplianceModel.getAuditPlansListMdl((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAuditPlansListCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update audit plan record
exports.updateAuditPlanCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.updateAuditPlanMdl(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Audit plan record not found or no changes made') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAuditPlanCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete audit plan record
exports.deleteAuditPlanCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.deleteAuditPlanMdl(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Audit plan record not found') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAuditPlanCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// ========== ASSIGN TEAM CONTROLLERS ==========

// Create new assign team record
exports.createAssignTeamCtrl = (req, res) => {
    try {
        const {
            audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, assignment_notes
        } = req.body;

        // Validate required fields
        if (!audit_title || !policy_manager || !scope_members || !lead_auditor || !reviewer || !evidence_approver || !site_coordinators || !observers || !due_reminder || !assignment_notes) {
            return res.status(400).json({
                success: false,
                message: 'audit_title, policy_manager, scope_members, lead_auditor, reviewer, evidence_approver, site_coordinators, observers, due_reminder, and assignment_notes are required'
            });
        }

        ComplianceModel.createAssignTeamMdl(req.body, (result) => {
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in createAssignTeamCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Get all assign team records
exports.getAssignTeamsListCtrl = (req, res) => {
    try {
        ComplianceModel.getAssignTeamsListMdl((result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in getAssignTeamsListCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Update assign team record
exports.updateAssignTeamCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.updateAssignTeamMdl(id, req.body, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Assign team record not found or no changes made') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in updateAssignTeamCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Delete assign team record
exports.deleteAssignTeamCtrl = (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is required in request body'
            });
        }

        ComplianceModel.deleteAssignTeamMdl(id, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else if (result.message === 'Assign team record not found') {
                res.status(404).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.error('Error in deleteAssignTeamCtrl:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            details: error.message
        });
    }
};
