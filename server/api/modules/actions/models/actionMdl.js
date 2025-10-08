const sqldb = require("../../../../../config/db.config");
const util = require('util');
const execQuery = util.promisify(sqldb.query).bind(sqldb);

exports.insertModuleWithActions = async (moduleData, actions) => {
    try {
        await createTablesIfNotExist();

        const insertModuleQuery = `
            INSERT INTO module_master (module_name, module_code, created_by, updated_by)
            VALUES (?, ?, ?, ?)
        `;
        const moduleResult = await execQuery(insertModuleQuery, [
            moduleData.module_name,
            moduleData.module_code,
            moduleData.created_by,
            moduleData.updated_by
        ]);

        const moduleId = moduleResult.insertId;

        if (actions && actions.length > 0) {
            const insertActionQuery = `
                INSERT INTO action_master (action_name, action_code, module_id, created_by, updated_by)
                VALUES ?
            `;
            const actionValues = actions.map(action => [
                action.action_name,
                action.action_code,
                moduleId,
                moduleData.created_by,
                moduleData.updated_by
            ]);

            await execQuery(insertActionQuery, [actionValues]);
        }

        return { success: true, module_id: moduleId };
    } catch (error) {
        throw error;
    }
};

// ✅ Function to create tables if they do not exist
async function createTablesIfNotExist() {
    const createModuleTableQuery = `
        CREATE TABLE IF NOT EXISTS module_master (
            module_id INT AUTO_INCREMENT PRIMARY KEY,
            module_name VARCHAR(255) NOT NULL,
            module_code VARCHAR(100) NOT NULL,
            created_by VARCHAR(100),
            updated_by VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    const createActionTableQuery = `
        CREATE TABLE IF NOT EXISTS action_master (
            action_id INT AUTO_INCREMENT PRIMARY KEY,
            action_name VARCHAR(255) NOT NULL,
            action_code VARCHAR(100) NOT NULL,
            module_id INT NOT NULL,
            created_by VARCHAR(100),
            updated_by VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (module_id) REFERENCES module_master(module_id) ON DELETE CASCADE
        )
    `;

    await execQuery(createModuleTableQuery);
    await execQuery(createActionTableQuery);
}


exports.getAllModules = async () => {
    try {
        const query = `SELECT mm.module_id, mm.module_name, mm.module_code,mm.module_status  FROM module_master as mm`; 
        const result = await execQuery(query);
        return result;
    } catch (error) {
        throw error;
    }
};
