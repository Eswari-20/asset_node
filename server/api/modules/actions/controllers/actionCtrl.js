const ActionModel = require("../models/actionMdl");

exports.createModuleWithActions = async (req, res) => {
    try {
        const { module, actions } = req.body;

        if (!module || !module.module_name || !module.module_code) {
            return res.status(400).json({ success: false, error: "Module name and code are required" });
        }

        const result = await ActionModel.insertModuleWithActions(module, actions);

        res.json({ success: true, message: "Module and actions inserted successfully", module_id: result.module_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Database error", details: err.message });
    }
};



exports.getModules = async (req, res) => {
    try {
        const modules = await ActionModel.getAllModules();
        return res.status(200).json({
            success: true,
            data: modules
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching modules",
            error: error.message
        });
    }
};