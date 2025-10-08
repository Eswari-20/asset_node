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
        console.log("🔧 execParamsQueryAsync called");
        console.log("📝 Query:", query);
        console.log("📝 Params:", params);
        console.log("📝 Context:", cntxt);
        
        dbutil.execParamsQuery(pool, query, params, cntxt, (err, results) => {
            if (err) {
                console.error("❌ execParamsQuery error:", err);
                return reject(err);
            }
            console.log("✅ execParamsQuery success:", results);
            resolve(results);
        });
    });
};

// ---------------------- Ensure necessary tables exist ----------------------
const ensureTables = async () => {
    const pool = getPool();

    const tableQueries = [
        `CREATE TABLE IF NOT EXISTS setting_status (
            id INT AUTO_INCREMENT PRIMARY KEY,
            status_name VARCHAR(255) NOT NULL,
            status_type VARCHAR(255),
            color_tag VARCHAR(50),
            description TEXT,
            is_default VARCHAR(10) DEFAULT '0',
            affects_availability VARCHAR(10) DEFAULT '0',
            include_in_utilization VARCHAR(10) DEFAULT '0',
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS setting_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_name VARCHAR(255) NOT NULL,
            parent_category VARCHAR(255),
            useful_life INT,
            description TEXT,
            default_depreciation VARCHAR(255),
            capex_opex VARCHAR(255),
            track_warranty VARCHAR(50) DEFAULT 'No',
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS setting_locations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(255),
            name VARCHAR(255) NOT NULL,
            code VARCHAR(255),
            parent_id INT,
            region_id VARCHAR(255),
            active_status VARCHAR(50) DEFAULT 'Active',
            address TEXT,
            notes TEXT,
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS setting_vendors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_name VARCHAR(255) NOT NULL,
            vendor_code VARCHAR(255),
            status VARCHAR(50) DEFAULT 'Active',
            primary_contact VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50),
            category VARCHAR(255),
            payment_terms VARCHAR(255),
            tax_id VARCHAR(255),
            address TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS payment_methods (
            id INT AUTO_INCREMENT PRIMARY KEY,
            method_name VARCHAR(255) NOT NULL,
            code VARCHAR(255),
            type VARCHAR(255),
            default_for VARCHAR(255),
            gl_account VARCHAR(255),
            processing_fee DECIMAL(10,2) DEFAULT 0.00,
            currency VARCHAR(10),
            approval_required VARCHAR(10) DEFAULT 'No',
            instructions TEXT,
            notes TEXT,
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS service_types (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type_name VARCHAR(255) NOT NULL,
            code VARCHAR(255),
            category VARCHAR(255),
            applicable_assets TEXT,
            default_vendor VARCHAR(255),
            sla_days INT,
            approval_required VARCHAR(10) DEFAULT 'No',
            cost_center VARCHAR(255),
            description TEXT,
            notes TEXT,
            status VARCHAR(50) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS approval_hierarchies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hierarchy_name VARCHAR(255) NOT NULL,
            code VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'Active',
            applicable_modules TEXT,
            department_location VARCHAR(255),
            threshold_amount DECIMAL(15,2),
            escalation_days INT,
            auto_assign_approvers VARCHAR(10) DEFAULT 'No',
            skip_on_leave VARCHAR(10) DEFAULT 'No',
            description TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`
    ];

    for (const query of tableQueries) {
        try {
            await new Promise((resolve, reject) => {
                pool.execute(query, [], (err, results) => {
                    if (err) {
                        console.error('❌ Error creating table:', err);
                        reject(err);
                    } else {
                        console.log('✅ Table created successfully');
                        resolve(results);
                    }
                });
            });
        } catch (err) {
            console.error('❌ Error creating table:', err);
        }
    }

    // Alter existing table columns if they exist with smaller sizes
    const alterQueries = [
        `ALTER TABLE setting_categories MODIFY COLUMN default_depreciation VARCHAR(255);`,
        `ALTER TABLE setting_categories MODIFY COLUMN capex_opex VARCHAR(255);`,
        `ALTER TABLE setting_categories MODIFY COLUMN track_warranty VARCHAR(50);`
    ];

    for (const query of alterQueries) {
        try {
            await new Promise((resolve, reject) => {
                pool.execute(query, [], (err, results) => {
                    if (err) {
                        // Ignore errors if column doesn't exist or is already correct size
                        console.log('ℹ️ Column alteration skipped (may already be correct):', err.message);
                        resolve(results);
                    } else {
                        console.log('✅ Column altered successfully');
                        resolve(results);
                    }
                });
            });
        } catch (err) {
            console.log('ℹ️ Column alteration skipped:', err.message);
        }
    }

    // Note: New columns will be added when needed

    // Note: No sample data insertion - using existing table data only
};

// Initialize tables after database connection is established
let tablesInitialized = false;
const initializeTables = async () => {
    try {
        await ensureTables();
        if (!tablesInitialized) {
            tablesInitialized = true;
            console.log('✅ Settings tables initialized successfully');
        }
    } catch (err) {
        console.error('❌ Error initializing settings tables:', err);
    }
};

// ===========================================
// SETTING STATUS MODEL
// ===========================================
exports.getSettingStatusList = async () => {
    console.log("🗄️ getSettingStatusList model called");
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    const query = 'SELECT * FROM setting_status where status=1 ORDER BY id DESC';
    console.log("🔍 Executing query:", query);
    const result = await new Promise((resolve, reject) => {
        pool.execute(query, [], (err, results) => {
            if (err) {
                console.error("❌ getSettingStatusList error:", err);
                reject(err);
            } else {
                console.log("✅ getSettingStatusList success:", results);
                resolve(results);
            }
        });
    });
    console.log("📊 Query result:", result);
    return result;
};

exports.createSettingStatus = async (data) => {
    console.log("🗄️ createSettingStatus model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const status_name = data.status_name || data.name || "";
    const status_type = data.status_type || "";
    const color_tag = data.color_tag || data.color || "#000000";
    const description = data.description || "";
    const is_default = data.is_default || "0";
    const affects_availability = data.affects_availability || "0";
    const include_in_utilization = data.include_in_utilization || "0";
    // const status = data.status || "Active";
    
    const query = 'INSERT INTO setting_status (status_name, status_type, color_tag, description, is_default, affects_availability, include_in_utilization, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [status_name, status_type, color_tag, description, is_default, affects_availability, include_in_utilization, 1];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ createSettingStatus error:", err);
                    reject(err);
                } else {
                    console.log("✅ createSettingStatus success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id: result.insertId, ...data };
    } catch (error) {
        console.error("❌ createSettingStatus error:", error);
        throw error;
    }
};

exports.updateSettingStatus = async (data) => {
    console.log("🗄️ updateSettingStatus model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const id = data.id;
    const status_name = data.status_name || data.name || "";
    const status_type = data.status_type || "";
    const color_tag = data.color_tag || data.color || "#000000";
    const description = data.description || "";
    const is_default = data.is_default || "0";
    const affects_availability = data.affects_availability || "0";
    const include_in_utilization = data.include_in_utilization || "0";
    const status = data.status || "Active";
    
    const query = 'UPDATE setting_status SET status_name = ?, status_type = ?, color_tag = ?, description = ?, is_default = ?, affects_availability = ?, include_in_utilization = ?, status = ? WHERE id = ?';
    const params = [status_name, status_type, color_tag, description, is_default, affects_availability, include_in_utilization, status, id];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ updateSettingStatus error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ updateSettingStatus success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id, ...data };
    } catch (error) {
        console.error("❌ updateSettingStatus error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.deleteSettingStatus = async (data) => {
    await initializeTables();
    const pool = getPool();
    const { id } = data;
    const query = 'DELETE FROM setting_status WHERE id = ?';
    const params = [id];
    await new Promise((resolve, reject) => {
        pool.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return { id, deleted: true };
};

// ===========================================
// SETTING CATEGORIES MODEL
// ===========================================
exports.getSettingCategoriesList = async () => {
    await initializeTables();
    const pool = getPool();
    const query = 'SELECT * FROM setting_categories where status=1 ORDER BY id DESC';
    return await new Promise((resolve, reject) => {
        pool.execute(query, [], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.createSettingCategory = async (data) => {
    console.log("🗄️ createSettingCategory model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Ensure no undefined values are passed to the database
    const category_name = data.category_name || data.name || "";
    const parent_category = data.parent_category || "";
    const useful_life = data.useful_life || null;
    const description = data.description || "";
    const default_depreciation = data.default_depreciation || "";
    const capex_opex = data.capex_opex || "";
    const track_warranty = data.track_warranty || "No";
    // const status = data.status || "Active";
    
    const query = 'INSERT INTO setting_categories (category_name, parent_category, useful_life, description, default_depreciation, capex_opex, track_warranty, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [category_name, parent_category, useful_life, description, default_depreciation, capex_opex, track_warranty, 1];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ createSettingCategory error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ createSettingCategory success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id: result.insertId, ...data };
    } catch (error) {
        console.error("❌ createSettingCategory error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.updateSettingCategory = async (data) => {
    console.log("🗄️ updateSettingCategory model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Ensure no undefined values are passed to the database
    const id = data.id;
    const category_name = data.category_name || data.name || "";
    const parent_category = data.parent_category || "";
    const useful_life = data.useful_life || null;
    const description = data.description || "";
    const default_depreciation = data.default_depreciation || "";
    const capex_opex = data.capex_opex || "";
    const track_warranty = data.track_warranty || "No";
    const status = data.status || "Active";
    
    const query = 'UPDATE setting_categories SET category_name = ?, parent_category = ?, useful_life = ?, description = ?, default_depreciation = ?, capex_opex = ?, track_warranty = ?, status = ? WHERE id = ?';
    const params = [category_name, parent_category, useful_life, description, default_depreciation, capex_opex, track_warranty, status, id];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ updateSettingCategory error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ updateSettingCategory success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id, ...data };
    } catch (error) {
        console.error("❌ updateSettingCategory error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.deleteSettingCategory = async (data) => {
    await initializeTables();
    const pool = getPool();
    const { id } = data;
    const query = 'DELETE FROM setting_categories WHERE id = ?';
    const params = [id];
    await new Promise((resolve, reject) => {
        pool.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return { id, deleted: true };
};

// ===========================================
// SETTING LOCATIONS MODEL
// ===========================================
exports.getSettingLocationsList = async () => {
    await initializeTables();
    const pool = getPool();
    const query = 'SELECT * FROM setting_locations where status=1 ORDER BY id DESC';
    return await new Promise((resolve, reject) => {
        pool.execute(query, [], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.createSettingLocation = async (data) => {
    console.log("🗄️ createSettingLocation model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const type = data.type || "";
    const name = data.name || "";
    const code = data.code || "";
    const parent_id = data.parent_id || null;
    const region_id = data.region_id || "";
    const active_status = data.active_status || "Active";
    const address = data.address || "";
    const notes = data.notes || "";
    // const status = data.status || "Active";
    
    const query = 'INSERT INTO setting_locations (type, name, code, parent_id, region_id, active_status, address, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [type, name, code, parent_id, region_id, active_status, address, notes, 1];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ createSettingLocation error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ createSettingLocation success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id: result.insertId, ...data };
    } catch (error) {
        console.error("❌ createSettingLocation error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.updateSettingLocation = async (data) => {
    console.log("🗄️ updateSettingLocation model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const id = data.id;
    const type = data.type || "";
    const name = data.name || "";
    const code = data.code || "";
    const parent_id = data.parent_id || null;
    const region_id = data.region_id || "";
    const active_status = data.active_status || "Active";
    const address = data.address || "";
    const notes = data.notes || "";
    const status = data.status || "Active";
    
    const query = 'UPDATE setting_locations SET type = ?, name = ?, code = ?, parent_id = ?, region_id = ?, active_status = ?, address = ?, notes = ?, status = ? WHERE id = ?';
    const params = [type, name, code, parent_id, region_id, active_status, address, notes, status, id];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ updateSettingLocation error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ updateSettingLocation success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id, ...data };
    } catch (error) {
        console.error("❌ updateSettingLocation error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.deleteSettingLocation = async (data) => {
    await initializeTables();
    const pool = getPool();
    const { id } = data;
    const query = 'DELETE FROM setting_locations WHERE id = ?';
    const params = [id];
    await new Promise((resolve, reject) => {
        pool.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return { id, deleted: true };
};

// ===========================================
// SETTING VENDORS MODEL
// ===========================================
exports.getSettingVendorsList = async () => {
    console.log("🗄️ getSettingVendorsList model called");
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    const query = 'SELECT * FROM setting_vendors where status=1 ORDER BY id DESC';
    console.log("🔍 Executing query:", query);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, [], (err, results) => {
                if (err) {
                    console.error("❌ getSettingVendorsList error:", err);
                    reject(err);
                } else {
                    console.log("✅ getSettingVendorsList success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
        return result;
    } catch (error) {
        console.error("❌ getSettingVendorsList error:", error);
        throw error;
    }
};

exports.createSettingVendor = async (data) => {
    console.log("🗄️ createSettingVendor model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const vendor_name = data.vendor_name || data.name || "";
    const vendor_code = data.vendor_code || "";
    // const status = data.status || "Active";
    const primary_contact = data.primary_contact || data.contact_person || "";
    const email = data.email || "";
    const phone = data.phone || "";
    const category = data.category || "";
    const payment_terms = data.payment_terms || "";
    const tax_id = data.tax_id || "";
    const address = data.address || "";
    const notes = data.notes || "";
    
    const query = 'INSERT INTO setting_vendors (vendor_name, vendor_code, status, primary_contact, email, phone, category, payment_terms, tax_id, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [vendor_name, vendor_code, 1, primary_contact, email, phone, category, payment_terms, tax_id, address, notes];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ createSettingVendor error:", err);
                    reject(err);
                } else {
                    console.log("✅ createSettingVendor success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id: result.insertId, ...data };
    } catch (error) {
        console.error("❌ createSettingVendor error:", error);
        throw error;
    }
};

exports.updateSettingVendor = async (data) => {
    console.log("🗄️ updateSettingVendor model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const id = data.id;
    const vendor_name = data.vendor_name || data.name || "";
    const vendor_code = data.vendor_code || "";
    const status = data.status || "Active";
    const primary_contact = data.primary_contact || data.contact_person || "";
    const email = data.email || "";
    const phone = data.phone || "";
    const category = data.category || "";
    const payment_terms = data.payment_terms || "";
    const tax_id = data.tax_id || "";
    const address = data.address || "";
    const notes = data.notes || "";
    
    const query = 'UPDATE setting_vendors SET vendor_name = ?, vendor_code = ?, status = ?, primary_contact = ?, email = ?, phone = ?, category = ?, payment_terms = ?, tax_id = ?, address = ?, notes = ? WHERE id = ?';
    const params = [vendor_name, vendor_code, status, primary_contact, email, phone, category, payment_terms, tax_id, address, notes, id];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ updateSettingVendor error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ updateSettingVendor success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id, ...data };
    } catch (error) {
        console.error("❌ updateSettingVendor error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.deleteSettingVendor = async (data) => {
    await initializeTables();
    const pool = getPool();
    const { id } = data;
    const query = 'DELETE FROM setting_vendors WHERE id = ?';
    const params = [id];
    await new Promise((resolve, reject) => {
        pool.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return { id, deleted: true };
};

// ===========================================
// PAYMENT METHODS MODEL
// ===========================================
exports.getPaymentMethodsList = async () => {
    await initializeTables();
    const pool = getPool();
    const query = 'SELECT * FROM payment_methods where status=1 ORDER BY id DESC';
    return await new Promise((resolve, reject) => {
        pool.execute(query, [], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.createPaymentMethod = async (data) => {
    console.log("🗄️ createPaymentMethod model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const method_name = data.method_name || data.name || "";
    const code = data.code || "";
    const type = data.type || "";
    const default_for = data.default_for || "";
    const gl_account = data.gl_account || "";
    const processing_fee = data.processing_fee || 0.00;
    const currency = data.currency || "";
    const approval_required = data.approval_required || "No";
    const instructions = data.instructions || data.description || "";
    const notes = data.notes || "";
    // const status = data.status || "Active";
    
    const query = 'INSERT INTO payment_methods (method_name, code, type, default_for, gl_account, processing_fee, currency, approval_required, instructions, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [method_name, code, type, default_for, gl_account, processing_fee, currency, approval_required, instructions, notes, 1];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ createPaymentMethod error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ createPaymentMethod success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id: result.insertId, ...data };
    } catch (error) {
        console.error("❌ createPaymentMethod error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.updatePaymentMethod = async (data) => {
    console.log("🗄️ updatePaymentMethod model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const id = data.id;
    const method_name = data.method_name || data.name || "";
    const code = data.code || "";
    const type = data.type || "";
    const default_for = data.default_for || "";
    const gl_account = data.gl_account || "";
    const processing_fee = data.processing_fee || 0.00;
    const currency = data.currency || "";
    const approval_required = data.approval_required || "No";
    const instructions = data.instructions || data.description || "";
    const notes = data.notes || "";
    const status = data.status || "Active";
    
    const query = 'UPDATE payment_methods SET method_name = ?, code = ?, type = ?, default_for = ?, gl_account = ?, processing_fee = ?, currency = ?, approval_required = ?, instructions = ?, notes = ?, status = ? WHERE id = ?';
    const params = [method_name, code, type, default_for, gl_account, processing_fee, currency, approval_required, instructions, notes, status, id];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ updatePaymentMethod error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ updatePaymentMethod success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id, ...data };
    } catch (error) {
        console.error("❌ updatePaymentMethod error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.deletePaymentMethod = async (data) => {
    await initializeTables();
    const pool = getPool();
    const { id } = data;
    const query = 'DELETE FROM payment_methods WHERE id = ?';
    const params = [id];
    await new Promise((resolve, reject) => {
        pool.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return { id, deleted: true };
};

// ===========================================
// SERVICE TYPES MODEL
// ===========================================
exports.getServiceTypesList = async () => {
    await initializeTables();
    const pool = getPool();
    const query = 'SELECT * FROM service_types where status=1 ORDER BY id DESC';
    return await new Promise((resolve, reject) => {
        pool.execute(query, [], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.createServiceType = async (data) => {
    console.log("🗄️ createServiceType model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const type_name = data.type_name || data.name || "";
    const code = data.code || "";
    const category = data.category || "";
    const applicable_assets = data.applicable_assets || "";
    const default_vendor = data.default_vendor || "";
    const sla_days = data.sla_days || null;
    const approval_required = data.approval_required || "No";
    const cost_center = data.cost_center || "";
    const description = data.description || "";
    const notes = data.notes || "";
    // const status = data.status || "Active";
    
    const query = 'INSERT INTO service_types (type_name, code, category, applicable_assets, default_vendor, sla_days, approval_required, cost_center, description, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [type_name, code, category, applicable_assets, default_vendor, sla_days, approval_required, cost_center, description, notes, 1];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ createServiceType error:", err);
                    reject(err);
                } else {
                    console.log("✅ createServiceType success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id: result.insertId, ...data };
    } catch (error) {
        console.error("❌ createServiceType error:", error);
        throw error;
    }
};

exports.updateServiceType = async (data) => {
    console.log("🗄️ updateServiceType model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Map the data to the new table structure
    const id = data.id;
    const type_name = data.type_name || data.name || "";
    const code = data.code || "";
    const category = data.category || "";
    const applicable_assets = data.applicable_assets || "";
    const default_vendor = data.default_vendor || "";
    const sla_days = data.sla_days || null;
    const approval_required = data.approval_required || "No";
    const cost_center = data.cost_center || "";
    const description = data.description || "";
    const notes = data.notes || "";
    const status = data.status || "Active";
    
    const query = 'UPDATE service_types SET type_name = ?, code = ?, category = ?, applicable_assets = ?, default_vendor = ?, sla_days = ?, approval_required = ?, cost_center = ?, description = ?, notes = ?, status = ? WHERE id = ?';
    const params = [type_name, code, category, applicable_assets, default_vendor, sla_days, approval_required, cost_center, description, notes, status, id];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ updateServiceType error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ updateServiceType success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
        return { id, ...data };
    } catch (error) {
        console.error("❌ updateServiceType error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.deleteServiceType = async (data) => {
    await initializeTables();
    const pool = getPool();
    const { id } = data;
    const query = 'DELETE FROM service_types WHERE id = ?';
    const params = [id];
    await new Promise((resolve, reject) => {
        pool.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return { id, deleted: true };
};

// ===========================================
// APPROVAL HIERARCHIES MODEL
// ===========================================
exports.getApprovalHierarchiesList = async () => {
    await initializeTables();
    const pool = getPool();
    const query = 'SELECT * FROM approval_hierarchies where status=1 ORDER BY id DESC';
    return await new Promise((resolve, reject) => {
        pool.execute(query, [], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

exports.createApprovalHierarchy = async (data) => {
    console.log("🗄️ createApprovalHierarchy model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Ensure no undefined values are passed to the database
    const hierarchy_name = data.hierarchy_name || data.name || "";
    const code = data.code || "";
    // const status = data.status || "Active";
    const applicable_modules = data.applicable_modules || "";
    const department_location = data.department_location || "";
    const threshold_amount = data.threshold_amount || 0.00;
    const escalation_days = data.escalation_days || null;
    const auto_assign_approvers = data.auto_assign_approvers || "No";
    const skip_on_leave = data.skip_on_leave || "No";
    const description = data.description || "";
    const notes = data.notes || "";
    
    const query = 'INSERT INTO approval_hierarchies (hierarchy_name, code, status, applicable_modules, department_location, threshold_amount, escalation_days, auto_assign_approvers, skip_on_leave, description, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [hierarchy_name, code, 1, applicable_modules, department_location, threshold_amount, escalation_days, auto_assign_approvers, skip_on_leave, description, notes];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ createApprovalHierarchy error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ createApprovalHierarchy success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id: result.insertId, ...data };
    } catch (error) {
        console.error("❌ createApprovalHierarchy error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.updateApprovalHierarchy = async (data) => {
    console.log("🗄️ updateApprovalHierarchy model called");
    console.log("📝 Data received:", data);
    await initializeTables();
    console.log("📋 Tables initialized, getting pool");
    const pool = getPool();
    
    // Ensure no undefined values are passed to the database
    const id = data.id;
    const hierarchy_name = data.hierarchy_name || data.name || "";
    const code = data.code || "";
    const status = data.status || "Active";
    const applicable_modules = data.applicable_modules || "";
    const department_location = data.department_location || "";
    const threshold_amount = data.threshold_amount || 0.00;
    const escalation_days = data.escalation_days || null;
    const auto_assign_approvers = data.auto_assign_approvers || "No";
    const skip_on_leave = data.skip_on_leave || "No";
    const description = data.description || "";
    const notes = data.notes || "";
    
    const query = 'UPDATE approval_hierarchies SET hierarchy_name = ?, code = ?, status = ?, applicable_modules = ?, department_location = ?, threshold_amount = ?, escalation_days = ?, auto_assign_approvers = ?, skip_on_leave = ?, description = ?, notes = ? WHERE id = ?';
    const params = [hierarchy_name, code, status, applicable_modules, department_location, threshold_amount, escalation_days, auto_assign_approvers, skip_on_leave, description, notes, id];
    console.log("🔍 Executing query:", query);
    console.log("📊 With params:", params);
    
    try {
        const result = await new Promise((resolve, reject) => {
            pool.execute(query, params, (err, results) => {
                if (err) {
                    console.error("❌ updateApprovalHierarchy error:", err);
                    console.error("❌ Error code:", err.code);
                    console.error("❌ Error message:", err.message);
                    console.error("❌ Error sql:", err.sql);
                    reject(err);
                } else {
                    console.log("✅ updateApprovalHierarchy success:", results);
                    resolve(results);
                }
            });
        });
        console.log("📊 Query result:", result);
    return { id, ...data };
    } catch (error) {
        console.error("❌ updateApprovalHierarchy error:", error);
        console.error("❌ Error stack:", error.stack);
        throw error;
    }
};

exports.deleteApprovalHierarchy = async (data) => {
    await initializeTables();
    const pool = getPool();
    const { id } = data;
    const query = 'DELETE FROM approval_hierarchies WHERE id = ?';
    const params = [id];
    await new Promise((resolve, reject) => {
        pool.execute(query, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return { id, deleted: true };
};