const express = require("express");
const router = express.Router();


// router.use('/plans', require('./plans/plansRtr'));
router.use('/auth', require('./auth/authRtr'));
console.log("🔧 Loading roles routes...");
router.use('/roles', require('./roles/rolesRtr'));
console.log("✅ Roles routes loaded");
router.use('/users', require('./users/usersRtr'));
router.use('/actions', require('./actions/actionRtr'));
console.log("🔧 Loading settings routes...");
router.use('/settings', require('./settings/settingsRoutes'));
console.log("✅ Settings routes loaded");
console.log("🔧 Loading assets routes...");
router.use('/assets', require('./assets/assetsRtr'));
console.log("✅ Assets routes loaded");
console.log("🔧 Loading maintenance routes...");
router.use('/maintenance', require('./maintenance/maintenanceRtr'));
console.log("✅ Maintenance routes loaded");
console.log("💰 Loading financials routes...");
router.use('/financials', require('./financials/financialsRtr'));
console.log("✅ Financials routes loaded");
console.log("🗑️ Loading disposal routes...");
router.use('/disposal', require('./disposal/disposalRtr'));
console.log("✅ Disposal routes loaded");
console.log("📋 Loading compliance routes...");
router.use('/compliance', require('./compliance/complianceRtr'));
console.log("✅ Compliance routes loaded");


// router.use('/idm/socket', require('/glits/web/code/iDoseMate/node/server/api/routes/webSocket/socketRtr'));

module.exports = router;
