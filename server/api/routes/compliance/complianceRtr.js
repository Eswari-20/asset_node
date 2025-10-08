const express = require("express");
const router = express.Router();
const ComplianceController = require("../../modules/compliance/controllers/compliance.controller");

console.log("📋 Setting up compliance routes...");

// ========== AUDIT ROUTES ==========
router.post("/audit", ComplianceController.createAuditCtrl);
console.log("✅ createAudit route registered");

router.get("/audit", ComplianceController.getAuditsListCtrl);
console.log("✅ getAuditsList route registered");

router.put("/audit", ComplianceController.updateAuditCtrl);
console.log("✅ updateAudit route registered");

router.delete("/audit", ComplianceController.deleteAuditCtrl);
console.log("✅ deleteAudit route registered");

// ========== AUDIT PLAN ROUTES ==========
router.post("/auditplan", ComplianceController.createAuditPlanCtrl);
console.log("✅ createAuditPlan route registered");

router.get("/auditplan", ComplianceController.getAuditPlansListCtrl);
console.log("✅ getAuditPlansList route registered");

router.put("/auditplan", ComplianceController.updateAuditPlanCtrl);
console.log("✅ updateAuditPlan route registered");

router.delete("/auditplan", ComplianceController.deleteAuditPlanCtrl);
console.log("✅ deleteAuditPlan route registered");

// ========== ASSIGN TEAM ROUTES ==========
router.post("/assignteam", ComplianceController.createAssignTeamCtrl);
console.log("✅ createAssignTeam route registered");

router.get("/assignteam", ComplianceController.getAssignTeamsListCtrl);
console.log("✅ getAssignTeamsList route registered");

router.put("/assignteam", ComplianceController.updateAssignTeamCtrl);
console.log("✅ updateAssignTeam route registered");

router.delete("/assignteam", ComplianceController.deleteAssignTeamCtrl);
console.log("✅ deleteAssignTeam route registered");

// ========== COMPLIANCE ROUTES ==========
router.post("/", ComplianceController.createComplianceCtrl);
console.log("✅ createCompliance route registered");

router.get("/", ComplianceController.getCompliancesListCtrl);
console.log("✅ getCompliancesList route registered");

router.put("/", ComplianceController.updateComplianceCtrl);
console.log("✅ updateCompliance route registered");

router.delete("/", ComplianceController.deleteComplianceCtrl);
console.log("✅ deleteCompliance route registered");

module.exports = router;
