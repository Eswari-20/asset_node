const express = require("express");
const router = express.Router();
const RoleController = require("../../modules/roles/controllers/roles.controller");

console.log("🔧 Setting up roles routes...");

router.get("/getModuleActions", RoleController.getActionModules);
console.log("✅ getModuleActions route registered");

router.get("/getRolesList", RoleController.getRolesListCtrl);
console.log("✅ getRolesList route registered");

router.post("/insertRolePermissions", RoleController.getInsertRolepermissions);

router.post("/getRoleWithPermissions", RoleController.getRoleWithPermissionsCtrl);

router.put("/update", RoleController.updateRoleCtrl);
router.delete("/roles", RoleController.deleteRoleCtrl);

router.post('/InsertModules', RoleController.createModuleWithActions);
router.get('/ListModules', RoleController.listModules);
router.put('/updateModules', RoleController.updateModule);
router.delete('/deleteModules', RoleController.deleteModule);

//location
//router.get("/location", RoleController.getLocationFromCoords);

module.exports = router;
