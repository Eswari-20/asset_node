const express = require("express");
const router = express.Router();
const ActionController = require("../../modules/actions/controllers/actionCtrl");

router.post('/InsertModuleWithActions', ActionController.createModuleWithActions);
router.get("/modules", ActionController.getModules);

module.exports = router;
