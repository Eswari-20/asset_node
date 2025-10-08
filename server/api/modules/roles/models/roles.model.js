const sqldb = require("../../../../../config/db.config");
const dbutil = require('../../../../../utils/db.utils');
const df = require('../../../../../utils/dflower.utils');
const cntxtDtls = df.getModuleMetaData(__dirname, __filename);
const axios = require('axios'); 
const turf = require('@turf/turf');
const fs = require('fs');
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
   
// ---------------------- Ensure necessary tables exist ----------------------
const ensureTables = async () => {
    const pool = sqldb.getPool();

    const tableQueries = [
        `CREATE TABLE IF NOT EXISTS roles (
            role_id INT AUTO_INCREMENT PRIMARY KEY,
            role_name VARCHAR(255) NOT NULL,
            role_code VARCHAR(255) NOT NULL,
            role_status TINYINT(1) DEFAULT 1,
            created_by INT NOT NULL,
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_by INT NOT NULL,
			updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS role_permissions (
            permissions_id INT AUTO_INCREMENT PRIMARY KEY,
            role_id INT NOT NULL,
            module_id INT NOT NULL,
            action_id INT NOT NULL,
            created_by INT NOT NULL,
            updated_by INT NOT NULL,
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_permission (role_id, module_id, action_id),
            FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
        );`,

        `CREATE TABLE IF NOT EXISTS module_master (
            module_id INT AUTO_INCREMENT PRIMARY KEY,
            module_name VARCHAR(255) NOT NULL,
            module_code VARCHAR(255),
            module_status TINYINT(1) DEFAULT 1,
            created_by INT NOT NULL,
            updated_by INT NOT NULL,
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,

        `CREATE TABLE IF NOT EXISTS action_master (
            action_id INT AUTO_INCREMENT PRIMARY KEY,
            module_id INT NOT NULL,
            action_name VARCHAR(255) NOT NULL,
            action_code VARCHAR(255),
            action_status TINYINT(1) DEFAULT 1,
            created_by INT NOT NULL,
            updated_by INT NOT NULL,
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (module_id) REFERENCES module_master(module_id) ON DELETE CASCADE
        );`
    ];

    for (const query of tableQueries) {
        await execParamsQueryAsync(pool, query, [], cntxtDtls);
    }

    console.log("All tables ensured successfully.");
};

// ---------------------- Get modules with actions ----------------------
exports.getModulesWithActions = async () => {
    const pool = sqldb.getPool();
    await ensureTables();

    const sql = `
        SELECT 
            m.module_id,
            m.module_name,
            m.module_status,
            a.action_id,
            a.action_code,
            a.action_name,
            a.action_status
        FROM module_master m
        JOIN action_master a ON a.module_id = m.module_id
        WHERE a.action_status = 1 AND m.module_status = 1
        ORDER BY m.module_id
    `;

    const results = await execParamsQueryAsync(pool, sql, [], cntxtDtls);

    const modulesMap = {};
    results.forEach(row => {
        if (!modulesMap[row.module_id]) {
            modulesMap[row.module_id] = {
                module_id: row.module_id,
                module_name: row.module_name,
                actions: []
            };
        }
        modulesMap[row.module_id].actions.push({
            action_id: row.action_id,
            action_code: row.action_code,
            action_name: row.action_name,
            action_status: row.action_status
        });
    });

    return Object.values(modulesMap);
};

//--------------Roles list--------------
exports.getRolesListMdl = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
              id as role_id, 
              role_name, 
              role_code,
              role_status, 
              created_at as created_on
            FROM roles
            ORDER BY created_at DESC
        `;

        const pool = sqldb.getPool();
        pool.query(sql, (err, rows) => {
            if (err) {
                console.error("SQL Error in getRolesListMdl:", err.sqlMessage);
                return reject(err);
            }
            resolve(rows);
        });
    });
};


// ---------------------- Insert role dynamically ----------------------
exports.getInsertRoleActionsMdl = async (data) => {
    const pool = sqldb.getPool();
    await ensureTables();

    const columns = [];
    const placeholders = [];
    const params = [];

    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
            columns.push(key);
            placeholders.push("?");
            params.push(data[key]);
        }
    });

    if (columns.length === 0) throw new Error("No valid columns provided for insertion.");

    const insertQuery = `INSERT INTO roles (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`;
    return await execParamsQueryAsync(pool, insertQuery, params, cntxtDtls);
};

// ---------------------- Insert role and permissions ----------------------

exports.insertRoleAndPermissionsMdl = (data, callback) => {
    const checkRoleQuery = `SELECT * FROM roles WHERE role_name = ? OR role_code = ?`;
    const pool = sqldb.getPool();

    pool.query(checkRoleQuery, [data.role_name, data.role_code], (err, existingRoles) => {
        if (err) return callback(err);

        if (existingRoles.length > 0) {
            return callback(null, {
                success: false,
                message: "Role name or role code already exists"
            });
        }

        const roleQuery = `INSERT INTO roles (role_name, role_code, role_status) VALUES (?, ?, ?)`;

        pool.query(roleQuery, [data.role_name, data.role_code, 'Active'], (err, roleResult) => {
            if (err) return callback(err);

            const roleId = roleResult.insertId;
            const permissionsData = [];

            // Prepare permissions data
            if (Array.isArray(data.permissions)) {
                data.permissions.forEach(permission => {
                    const moduleId = permission.module_id;
                    permission.action_ids.forEach(actionId => {
                        permissionsData.push([roleId, moduleId, actionId, data.created_by, data.updated_by]);
                    });
                });
            }

            if (permissionsData.length === 0) {
                return callback(null, {
                    success: true,
                    roleId,
                    message: "Role inserted without permissions"
                });
            }

            const permQuery = `
                INSERT IGNORE INTO role_permissions (role_id, module_id, action_id, created_by, updated_by)
                VALUES ?
            `;

            pool.query(permQuery, [permissionsData], (err, permResult) => {
                if (err) return callback(err);

                return callback(null, {
                    success: true,
                    roleId,
                    message: "Role and permissions inserted successfully",
                    inserted: permResult.affectedRows
                });
            });
        });
    });
};


// ---------------------- Get role with permissions ----------------------
exports.getRoleWithPermissionsMdl = async (role_id) => {
    const pool = sqldb.getPool();
    await ensureTables();

    const QRY_TO_EXEC = `
        SELECT 
            r.role_id,
            r.role_name,
            r.role_code,
            rp.permissions_id AS permission_id,
            m.module_name,
            m.module_id,
            a.action_name,
            a.action_id
        FROM roles r
        LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
        LEFT JOIN module_master m ON rp.module_id = m.module_id
        LEFT JOIN action_master a ON rp.action_id = a.action_id
        WHERE r.id = ?;
    `;

    const results = await execParamsQueryAsync(pool, QRY_TO_EXEC, [role_id], cntxtDtls);

    const roleData = { role_id: null, role_name: null, role_code: null, permissions: [] };
    
    results.forEach(row => {
        if (!roleData.role_id) {
            roleData.role_id = row.role_id;
            roleData.role_name = row.role_name;
            roleData.role_code = row.role_code;
        }
        if (row.permission_id) { // match alias
            roleData.permissions.push({
                permission_id: row.permission_id,
                module: row.module_name,
                module_id: row.module_id,
                action: row.action_name,
                action_id: row.action_id
            });
        }
    });

    return roleData;
};

//update roles and actions
exports.updateRoleAndPermissionsMdl = (roleId, data, callback) => {
    if (!roleId) return callback(new Error("roleId is required"));

    const checkRoleQuery = `SELECT * FROM roles WHERE (role_name = ? OR role_code = ?) AND id != ?`;
    const pool = sqldb.getPool();

    pool.query(checkRoleQuery, [data.role_name, data.role_code, roleId], (err, existingRoles) => {
        if (err) return callback(err);

        if (existingRoles.length > 0) {
            return callback(null, {
                success: false,
                message: "Role name or role code already exists"
            });
        }

        const updateRoleQuery = `UPDATE roles SET role_name = ?, role_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        pool.query(updateRoleQuery, [data.role_name, data.role_code, roleId], (err) => {
            if (err) return callback(err);

            const deletePermQuery = `DELETE FROM role_permissions WHERE role_id = ?`;
            pool.query(deletePermQuery, [roleId], (err) => {
                if (err) return callback(err);

                const permissionsData = [];
                const createdBy = data.updated_by || 0;
                const updated_by = data.updated_by || 0;

                if (Array.isArray(data.permissions)) {
                    data.permissions.forEach(permission => {
                        const moduleId = permission.module_id;
                        permission.action_ids.forEach(actionId => {
                            permissionsData.push([roleId, moduleId, actionId, createdBy, updated_by]);
                        });
                    });
                }

                if (permissionsData.length === 0) {
                    return callback(null, {
                        success: true,
                        message: "Role updated without permissions"
                    });
                }

                const permQuery = `
                    INSERT INTO role_permissions (role_id, module_id, action_id, created_by, updated_by)
                    VALUES ?
                `;

                pool.query(permQuery, [permissionsData], (err, permResult) => {
                    if (err) return callback(err);

                    return callback(null, {
                        success: true,
                        message: "Role and permissions updated successfully",
                        updatedPermissions: permResult.affectedRows
                    });
                });
            });
        });
    });
};




// Delete Role by ID
exports.deleteRoleMdl = async (id) => {
    const pool = sqldb.getPool();
    await ensureTables();

    // role_permissions has ON DELETE CASCADE, so they will be deleted automatically
    const query = `DELETE FROM roles WHERE id = ?`;
    const result = await execParamsQueryAsync(pool, query, [id], cntxtDtls);
    return result;
};





exports.insertModuleWithActions = async (moduleData, actions = []) => {
    // 1️⃣ Check if module already exists
    const existing = await execQuery(
        `SELECT module_id FROM module_master WHERE module_name = ?`,
        [moduleData.module_name]
    );

    let module_id;
    if (existing.length > 0) {
        return { error: 'Module already exists', module_id: existing[0].module_id };
    } else {
        // 2️⃣ Insert into module_master
        const columns = [];
        const placeholders = [];
        const params = [];

        Object.keys(moduleData).forEach(key => {
            if (moduleData[key] !== undefined && moduleData[key] !== null) {
                columns.push(key);
                placeholders.push("?");
                params.push(moduleData[key]);
            }
        });

        const insertModuleQuery = `INSERT INTO module_master (${columns.join(",")}) VALUES (${placeholders.join(",")})`;
        const result = await execQuery(insertModuleQuery, params);
        module_id = result.insertId;
    }

    // 3️⃣ Insert actions into action_master
    const insertedActions = [];
    for (let action of actions) {
        action.module_id = module_id; // link to module
        const actionColumns = [];
        const actionPlaceholders = [];
        const actionParams = [];

        Object.keys(action).forEach(key => {
            if (action[key] !== undefined && action[key] !== null) {
                actionColumns.push(key);
                actionPlaceholders.push("?");
                actionParams.push(action[key]);
            }
        });

        const insertActionQuery = `INSERT INTO action_master (${actionColumns.join(",")}) VALUES (${actionPlaceholders.join(",")})`;
        const actionResult = await execQuery(insertActionQuery, actionParams);
        insertedActions.push({ action_id: actionResult.insertId, action_name: action.action_name });
    }

    return { module_id, actions: insertedActions };
};




exports.getModules = async () => {
    const query = `SELECT * FROM module_master`;
    const rows = await execQuery(query);
    return rows;
};


exports.updateModule = async (id, data) => {
    const sets = [];
    const params = [];

    Object.keys(data).forEach((key) => {
        sets.push(`${key} = ?`);
        params.push(data[key]);
    });

    const query = `UPDATE module_master SET ${sets.join(", ")} WHERE module_id = ?`;
    params.push(id);

    const result = await execQuery(query, params);
    return result;
};


exports.deleteRole = async (id) => {
  const query = `DELETE FROM roles WHERE role_id = ?`;
  const result = await execQuery(query, [id]);
  return result;
};






//AIzaSyDQIaT3iGUN_2TBrwzUE29ciHG1VywsFgA

// Safely load blocks GeoJSON
/*const blocksGeoJSON = JSON.parse(fs.readFileSync(
  '/glits/web/code/CMS-Node/node/server/api/modules/roles/models/india.geojson'
));

exports.getLocationDetails = async (lat, lon) => {
    const apiKey = "AIzaSyDQIaT3iGUN_2TBrwzUE29ciHG1VywsFgA"; // safer to store in env
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    try {
        // 1️⃣ Find location details using GeoJSON
        const point = turf.point([lon, lat]);
        let blockName = null;
        let districtName = null;
        let stateName = null;
        let mandalName = null;
        let villageName = null;

        for (const feature of blocksGeoJSON.features) {
            if (turf.booleanPointInPolygon(point, feature.geometry)) {
                blockName = feature.properties.BLOCK_NAME || feature.properties.SUBDIST || null;
                districtName = feature.properties.DISTRICT_NAME || feature.properties.DISTRICT || null;
                stateName = feature.properties.STATE_NAME || feature.properties.ST_NM || null;
                mandalName = feature.properties.MANDAL_NAME || feature.properties.TEHSIL || feature.properties.SUBDIST || null;
                villageName = feature.properties.VILLAGE_NAME || feature.properties.VILLAGE || null;
                break;
            }
        }

        // 2️⃣ Call Google API for fallback and full address
        const response = await axios.get(url);
        let formatted_address = null;
        let components = [];

        if (response.data.status === "OK" && response.data.results.length > 0) {
            const result = response.data.results[0];
            formatted_address = result.formatted_address;
            components = result.address_components;

            // Use Google data if GeoJSON didn't have it
            if (!districtName) {
                const distComp = components.find(c => c.types.includes("administrative_area_level_2"));
                districtName = distComp ? distComp.long_name : null;
            }
            if (!stateName) {
                const stateComp = components.find(c => c.types.includes("administrative_area_level_1"));
                stateName = stateComp ? stateComp.long_name : null;
            }
            if (!blockName) {
                const blockComp = components.find(c => c.types.includes("administrative_area_level_3"));
                blockName = blockComp ? blockComp.long_name : null;
            }
        }

        return {
            formatted_address: formatted_address || "Not found",
            components: components,
            state: stateName || "Not found",
            district: districtName || "Not found",
            block: blockName || "Not found",
            mandal: mandalName || "Not found",
            village: villageName || "Not found"
        };

    } catch (err) {
        console.error("Error in getLocationDetails:", err);
        throw err;
    }
};*/  // this is to get the geo details of lat long