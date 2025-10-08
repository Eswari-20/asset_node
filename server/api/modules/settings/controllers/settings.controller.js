const SettingsModel = require("../models/settings.model");

// Setting Status Controllers
exports.getSettingStatusListCtrl = async (req, res) => {
    console.log("🎯 getSettingStatusListCtrl called");
    try {
        console.log("📊 Calling SettingsModel.getSettingStatusList()");
        const rows = await SettingsModel.getSettingStatusList();
        console.log("✅ Got data from model:", rows);
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("❌ Error fetching setting status list:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

exports.createSettingStatusCtrl = async (req, res) => {
    console.log("🎯 createSettingStatusCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.status_name) {
            return res.status(400).json({
                success: false,
                error: "status_name is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            status_name: req.body.status_name,
            status_type: req.body.status_type || "",
            color_tag: req.body.color_tag || "#000000",
            description: req.body.description || "",
            is_default: req.body.is_default || "0",
            affects_availability: req.body.affects_availability || "0",
            include_in_utilization: req.body.include_in_utilization || "0",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.createSettingStatus(data);
        console.log("✅ Setting status created:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Setting status created successfully"
        });
    } catch (err) {
        console.error("❌ Error creating setting status:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.updateSettingStatusCtrl = async (req, res) => {
    console.log("🎯 updateSettingStatusCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                error: "id is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            id: req.body.id,
            status_name: req.body.status_name || req.body.name || "",
            status_type: req.body.status_type || "",
            color_tag: req.body.color_tag || req.body.color || "#000000",
            description: req.body.description || "",
            is_default: req.body.is_default || "0",
            affects_availability: req.body.affects_availability || "0",
            include_in_utilization: req.body.include_in_utilization || "0",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.updateSettingStatus(data);
        console.log("✅ Setting status updated:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Setting status updated successfully"
        });
    } catch (err) {
        console.error("❌ Error updating setting status:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.deleteSettingStatusCtrl = async (req, res) => {
    try {
        const result = await SettingsModel.deleteSettingStatus(req.body);
        res.json({
            success: true,
            data: result,
            message: "Setting status deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting setting status:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

// Setting Categories Controllers
exports.getSettingCategoriesListCtrl = async (req, res) => {
    try {
        const rows = await SettingsModel.getSettingCategoriesList();
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Error fetching setting categories list:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

exports.createSettingCategoryCtrl = async (req, res) => {
    console.log("🎯 createSettingCategoryCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.category_name) {
            return res.status(400).json({
                success: false,
                error: "category_name is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            category_name: req.body.category_name,
            parent_category: req.body.parent_category || "",
            useful_life: req.body.useful_life || null,
            description: req.body.description || "",
            default_depreciation: req.body.default_depreciation || "",
            capex_opex: req.body.capex_opex || "",
            track_warranty: req.body.track_warranty || "No",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.createSettingCategory(data);
        console.log("✅ Setting category created:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Setting category created successfully"
        });
    } catch (err) {
        console.error("❌ Error creating setting category:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.updateSettingCategoryCtrl = async (req, res) => {
    console.log("🎯 updateSettingCategoryCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                error: "id is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            id: req.body.id,
            category_name: req.body.category_name || req.body.name || "",
            parent_category: req.body.parent_category || "",
            useful_life: req.body.useful_life || null,
            description: req.body.description || "",
            default_depreciation: req.body.default_depreciation || "",
            capex_opex: req.body.capex_opex || "",
            track_warranty: req.body.track_warranty || "No",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.updateSettingCategory(data);
        console.log("✅ Setting category updated:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Setting category updated successfully"
        });
    } catch (err) {
        console.error("❌ Error updating setting category:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.deleteSettingCategoryCtrl = async (req, res) => {
    try {
        const result = await SettingsModel.deleteSettingCategory(req.body);
        res.json({
            success: true,
            data: result,
            message: "Setting category deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting setting category:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

// Setting Locations Controllers
exports.getSettingLocationsListCtrl = async (req, res) => {
    try {
        const rows = await SettingsModel.getSettingLocationsList();
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Error fetching setting locations list:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

exports.createSettingLocationCtrl = async (req, res) => {
    console.log("🎯 createSettingLocationCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                error: "name is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            type: req.body.type || "",
            name: req.body.name,
            code: req.body.code || "",
            parent_id: req.body.parent_id || null,
            region_id: req.body.region_id || "",
            active_status: req.body.active_status || "Active",
            address: req.body.address || "",
            notes: req.body.notes || "",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.createSettingLocation(data);
        console.log("✅ Setting location created:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Setting location created successfully"
        });
    } catch (err) {
        console.error("❌ Error creating setting location:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.updateSettingLocationCtrl = async (req, res) => {
    console.log("🎯 updateSettingLocationCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                error: "id is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            id: req.body.id,
            type: req.body.type || "",
            name: req.body.name || "",
            code: req.body.code || "",
            parent_id: req.body.parent_id || null,
            region_id: req.body.region_id || "",
            active_status: req.body.active_status || "Active",
            address: req.body.address || "",
            notes: req.body.notes || "",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.updateSettingLocation(data);
        console.log("✅ Setting location updated:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Setting location updated successfully"
        });
    } catch (err) {
        console.error("❌ Error updating setting location:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.deleteSettingLocationCtrl = async (req, res) => {
    try {
        const result = await SettingsModel.deleteSettingLocation(req.body);
        res.json({
            success: true,
            data: result,
            message: "Setting location deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting setting location:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

// Setting Vendors Controllers
exports.getSettingVendorsListCtrl = async (req, res) => {
    try {
        const rows = await SettingsModel.getSettingVendorsList();
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Error fetching setting vendors list:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

exports.createSettingVendorCtrl = async (req, res) => {
    console.log("🎯 createSettingVendorCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.vendor_name) {
            return res.status(400).json({
                success: false,
                error: "vendor_name is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            vendor_name: req.body.vendor_name,
            vendor_code: req.body.vendor_code || "",
            status: req.body.status || "Active",
            primary_contact: req.body.primary_contact || "",
            email: req.body.email || "",
            phone: req.body.phone || "",
            category: req.body.category || "",
            payment_terms: req.body.payment_terms || "",
            tax_id: req.body.tax_id || "",
            address: req.body.address || "",
            notes: req.body.notes || ""
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.createSettingVendor(data);
        console.log("✅ Setting vendor created:", result);

        res.json({
            success: true,
            data: result,
            message: "Setting vendor created successfully"
        });
    } catch (err) {
        console.error("❌ Error creating setting vendor:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.updateSettingVendorCtrl = async (req, res) => {
    console.log("🎯 updateSettingVendorCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                error: "id is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            id: req.body.id,
            vendor_name: req.body.vendor_name || req.body.name || "",
            vendor_code: req.body.vendor_code || "",
            status: req.body.status || "Active",
            primary_contact: req.body.primary_contact || req.body.contact_person || "",
            email: req.body.email || "",
            phone: req.body.phone || "",
            category: req.body.category || "",
            payment_terms: req.body.payment_terms || "",
            tax_id: req.body.tax_id || "",
            address: req.body.address || "",
            notes: req.body.notes || ""
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.updateSettingVendor(data);
        console.log("✅ Setting vendor updated:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Setting vendor updated successfully"
        });
    } catch (err) {
        console.error("❌ Error updating setting vendor:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.deleteSettingVendorCtrl = async (req, res) => {
    try {
        const result = await SettingsModel.deleteSettingVendor(req.body);
        res.json({
            success: true,
            data: result,
            message: "Setting vendor deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting setting vendor:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

// Payment Methods Controllers
exports.getPaymentMethodsListCtrl = async (req, res) => {
    try {
        const rows = await SettingsModel.getPaymentMethodsList();
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Error fetching payment methods list:", err);
    res.status(500).json({
      success: false,
            error: "Database error"
    });
  }
};

exports.createPaymentMethodCtrl = async (req, res) => {
    console.log("🎯 createPaymentMethodCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.method_name) {
            return res.status(400).json({
                success: false,
                error: "method_name is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            method_name: req.body.method_name,
            code: req.body.code || "",
            type: req.body.type || "",
            default_for: req.body.default_for || "",
            gl_account: req.body.gl_account || "",
            processing_fee: req.body.processing_fee || 0.00,
            currency: req.body.currency || "",
            approval_required: req.body.approval_required || "No",
            instructions: req.body.instructions || "",
            notes: req.body.notes || "",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.createPaymentMethod(data);
        console.log("✅ Payment method created:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Payment method created successfully"
        });
    } catch (err) {
        console.error("❌ Error creating payment method:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.updatePaymentMethodCtrl = async (req, res) => {
    console.log("🎯 updatePaymentMethodCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                error: "id is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            id: req.body.id,
            method_name: req.body.method_name || req.body.name || "",
            code: req.body.code || "",
            type: req.body.type || "",
            default_for: req.body.default_for || "",
            gl_account: req.body.gl_account || "",
            processing_fee: req.body.processing_fee || 0.00,
            currency: req.body.currency || "",
            approval_required: req.body.approval_required || "No",
            instructions: req.body.instructions || req.body.description || "",
            notes: req.body.notes || "",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.updatePaymentMethod(data);
        console.log("✅ Payment method updated:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Payment method updated successfully"
        });
    } catch (err) {
        console.error("❌ Error updating payment method:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.deletePaymentMethodCtrl = async (req, res) => {
    try {
        const result = await SettingsModel.deletePaymentMethod(req.body);
        res.json({
            success: true,
            data: result,
            message: "Payment method deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting payment method:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

// Service Types Controllers
exports.getServiceTypesListCtrl = async (req, res) => {
    try {
        const rows = await SettingsModel.getServiceTypesList();
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Error fetching service types list:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

exports.createServiceTypeCtrl = async (req, res) => {
    console.log("🎯 createServiceTypeCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.type_name) {
            return res.status(400).json({
                success: false,
                error: "type_name is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            type_name: req.body.type_name,
            code: req.body.code || "",
            category: req.body.category || "",
            applicable_assets: req.body.applicable_assets || "",
            default_vendor: req.body.default_vendor || "",
            sla_days: req.body.sla_days || null,
            approval_required: req.body.approval_required || "No",
            cost_center: req.body.cost_center || "",
            description: req.body.description || "",
            notes: req.body.notes || "",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.createServiceType(data);
        console.log("✅ Service type created:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Service type created successfully"
        });
    } catch (err) {
        console.error("❌ Error creating service type:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.updateServiceTypeCtrl = async (req, res) => {
    console.log("🎯 updateServiceTypeCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                error: "id is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            id: req.body.id,
            type_name: req.body.type_name || req.body.name || "",
            code: req.body.code || "",
            category: req.body.category || "",
            applicable_assets: req.body.applicable_assets || "",
            default_vendor: req.body.default_vendor || "",
            sla_days: req.body.sla_days || null,
            approval_required: req.body.approval_required || "No",
            cost_center: req.body.cost_center || "",
            description: req.body.description || "",
            notes: req.body.notes || "",
            status: req.body.status || "Active"
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.updateServiceType(data);
        console.log("✅ Service type updated:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Service type updated successfully"
        });
    } catch (err) {
        console.error("❌ Error updating service type:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.deleteServiceTypeCtrl = async (req, res) => {
    try {
        const result = await SettingsModel.deleteServiceType(req.body);
    res.json({
      success: true,
      data: result,
            message: "Service type deleted successfully"
    });
    } catch (err) {
        console.error("Error deleting service type:", err);
    res.status(500).json({
      success: false,
            error: "Database error"
    });
  }
};

// Approval Hierarchies Controllers
exports.getApprovalHierarchiesListCtrl = async (req, res) => {
    try {
        const rows = await SettingsModel.getApprovalHierarchiesList();
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("Error fetching approval hierarchies list:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};

exports.createApprovalHierarchyCtrl = async (req, res) => {
    console.log("🎯 createApprovalHierarchyCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.hierarchy_name && !req.body.name) {
            return res.status(400).json({
                success: false,
                error: "hierarchy_name or name is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            hierarchy_name: req.body.hierarchy_name || req.body.name,
            code: req.body.code || "",
            status: req.body.status || "Active",
            applicable_modules: req.body.applicable_modules || "",
            department_location: req.body.department_location || "",
            threshold_amount: req.body.threshold_amount || 0.00,
            escalation_days: req.body.escalation_days || null,
            auto_assign_approvers: req.body.auto_assign_approvers || "No",
            skip_on_leave: req.body.skip_on_leave || "No",
            description: req.body.description || "",
            notes: req.body.notes || ""
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.createApprovalHierarchy(data);
        console.log("✅ Approval hierarchy created:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Approval hierarchy created successfully"
        });
    } catch (err) {
        console.error("❌ Error creating approval hierarchy:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.updateApprovalHierarchyCtrl = async (req, res) => {
    console.log("🎯 updateApprovalHierarchyCtrl called");
    console.log("📝 Request body:", req.body);
    
    try {
        // Validate required fields
        if (!req.body.id) {
            return res.status(400).json({
                success: false,
                error: "id is required"
            });
        }

        // Map the request fields to the model fields
        const data = {
            id: req.body.id,
            hierarchy_name: req.body.hierarchy_name || req.body.name || "",
            code: req.body.code || "",
            status: req.body.status || "Active",
            applicable_modules: req.body.applicable_modules || "",
            department_location: req.body.department_location || "",
            threshold_amount: req.body.threshold_amount || 0.00,
            escalation_days: req.body.escalation_days || null,
            auto_assign_approvers: req.body.auto_assign_approvers || "No",
            skip_on_leave: req.body.skip_on_leave || "No",
            description: req.body.description || "",
            notes: req.body.notes || ""
        };
        console.log("📊 Mapped data:", data);
        
        const result = await SettingsModel.updateApprovalHierarchy(data);
        console.log("✅ Approval hierarchy updated:", result);
        
        res.json({
            success: true,
            data: result,
            message: "Approval hierarchy updated successfully"
        });
    } catch (err) {
        console.error("❌ Error updating approval hierarchy:", err);
        console.error("❌ Error stack:", err.stack);
        
        res.status(500).json({
            success: false,
            error: "Database error",
            details: err.message
        });
    }
};

exports.deleteApprovalHierarchyCtrl = async (req, res) => {
    try {
        const result = await SettingsModel.deleteApprovalHierarchy(req.body);
        res.json({
            success: true,
            data: result,
            message: "Approval hierarchy deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting approval hierarchy:", err);
        res.status(500).json({
            success: false,
            error: "Database error"
        });
    }
};