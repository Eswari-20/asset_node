const express = require("express");
const router = express.Router();
const SettingsController = require("../../modules/settings/controllers/settings.controller");

// Setting Status Routes
router.get("/getSettingStatusList", SettingsController.getSettingStatusListCtrl);
router.post("/createSettingStatus", SettingsController.createSettingStatusCtrl);
router.put("/updateSettingStatus", SettingsController.updateSettingStatusCtrl);
router.delete("/deleteSettingStatus", SettingsController.deleteSettingStatusCtrl);

// Setting Categories Routes
router.get("/getSettingCategoriesList", SettingsController.getSettingCategoriesListCtrl);
router.post("/createSettingCategory", SettingsController.createSettingCategoryCtrl);
router.put("/updateSettingCategory", SettingsController.updateSettingCategoryCtrl);
router.delete("/deleteSettingCategory", SettingsController.deleteSettingCategoryCtrl);

// Setting Locations Routes
router.get("/getSettingLocationsList", SettingsController.getSettingLocationsListCtrl);
router.post("/createSettingLocation", SettingsController.createSettingLocationCtrl);
router.put("/updateSettingLocation", SettingsController.updateSettingLocationCtrl);
router.delete("/deleteSettingLocation", SettingsController.deleteSettingLocationCtrl);

// Setting Vendors Routes
router.get("/getSettingVendorsList", SettingsController.getSettingVendorsListCtrl);
router.post("/createSettingVendor", SettingsController.createSettingVendorCtrl);
router.put("/updateSettingVendor", SettingsController.updateSettingVendorCtrl);
router.delete("/deleteSettingVendor", SettingsController.deleteSettingVendorCtrl);

// Payment Methods Routes
router.get("/getPaymentMethodsList", SettingsController.getPaymentMethodsListCtrl);
router.post("/createPaymentMethod", SettingsController.createPaymentMethodCtrl);
router.put("/updatePaymentMethod", SettingsController.updatePaymentMethodCtrl);
router.delete("/deletePaymentMethod", SettingsController.deletePaymentMethodCtrl);

// Service Types Routes
router.get("/getServiceTypesList", SettingsController.getServiceTypesListCtrl);
router.post("/createServiceType", SettingsController.createServiceTypeCtrl);
router.put("/updateServiceType", SettingsController.updateServiceTypeCtrl);
router.delete("/deleteServiceType", SettingsController.deleteServiceTypeCtrl);

// Approval Hierarchies Routes
router.get("/getApprovalHierarchiesList", SettingsController.getApprovalHierarchiesListCtrl);
router.post("/createApprovalHierarchy", SettingsController.createApprovalHierarchyCtrl);
router.put("/updateApprovalHierarchy", SettingsController.updateApprovalHierarchyCtrl);
router.delete("/deleteApprovalHierarchy", SettingsController.deleteApprovalHierarchyCtrl);

module.exports = router;