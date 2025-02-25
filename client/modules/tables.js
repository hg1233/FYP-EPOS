class TablesModule {

    net_manager;
    tables;

    constructor() {
        this.tables = {};
        this.net_manager = null;
    }

    init() {
        this.cacheTableData();
    }

    async cacheTableData() {
        var tables = await this.net_manager.pre_ready_request('/api/tables/get/all');

        tables.forEach(table => {
            // parse 0 & 1 as true & false
            table["enabled"] = Boolean(table["enabled"])
            this.addTableToLocalCache(table)
        })

        console.log(`Loaded tables (total: ${Object.keys(this.tables).length}).`)
    }

    addTableToLocalCache(table) {
        try {
            this.validateTableData(table);
            this.tables[table.id] = table;
        } catch(err) {
            // dont add table if it fails validation
            return;
        }
    }

    validateTableData(table) {
        // check core clerk info supplied
        if(typeof table.id != "number" || !table.seats){ 
            throw new Error("Invalid table data.");
        }
    }

    async getAllTables() {
        return this.tables;
    }

    async reloadTables() {
        this.tables = {};
        this.cacheTableData();
    }

    async getTableByID(id) {
        return this.tables[id];
    }

    async createTable(display_name, seats) {

        // input validation
        if(!this.isDisplayNameValid(display_name)) {
            console.error(`Cannot create table - display_name invalid`);
            return;
        }

        if(!this.isSeatsValid(seats)) {
            console.error(`Cannot create table - seats invalid`);
            return;
        }

        // input validation passed - create table
        var response = await this.net_manager.async_post('/api/tables/create', {display_name: display_name, seats: seats});
            
        if(response["message"] != undefined) {
            
            // success - create local object
            var table = {id: response.table_id, display_name: display_name, seats: seats, enabled: true}

            this.tables[response.table_id] = table;
            return true;
        } else {
            return {error: "Error occurred creating table", details: response["error"]}
        }


    }

    async changeStatus(id, new_status) {
      
        // check table exists
        if(!this.tables[id]) {
            console.error(`Cannot update table with ID ${id} - table not found.`);
            return;
        }

        // check desired status is a boolean (& therefore valid)
        if(typeof new_status != "boolean") {
            console.error(`Cannot update table with ID ${id} - invalid status defined`);
            return;
        }

        // input validation passed - create table
        
        var endpoint = "";
        
        if(new_status == true) {
            endpoint = "/api/tables/enable";
        } else {
            endpoint = "/api/tables/disable";
        }

        var response = await this.net_manager.async_post(endpoint, {id: id});

        // check if updating remote server was successsful
        if(response["message"] != undefined) {
            this.tables[id]["enabled"] = new_status;
            return true;
        } else {
            console.error("Error making remote table status update")
            console.error(response)
            return null;
        }

    }

    async updateTable(id, display_name, seats) {

        // check table exists
        if(!this.tables[id]) {
            console.error(`Cannot update table with ID ${id} - table not found.`);
            return;
        }

        // input validation
        if(!this.isDisplayNameValid(display_name)) {
            console.error(`Cannot update table with ID ${id} - display_name invalid`);
            return;
        }

        if(!this.isSeatsValid(seats)) {
            console.error(`Cannot update table with ID ${id} - seats invalid`);
            return;
        }



        var response = await this.net_manager.async_post('/api/tables/update', {id: id, display_name: display_name, seats: seats});

        if(response["message"] != undefined) {
            // parse boolean int values 0 & 1 to true/false
            response["new_data"]["enabled"] = Boolean(response["new_data"]["enabled"]);
            // update local cached data
            this.tables[id] = response["new_data"];
            return true;
        } else {
            console.debug(response)
            return {error: "Error occurred carrying out remote table update"}
        }

        
    }

    invokeIPCHandles(moduleManager, ipcMain) {

        ipcMain.handle('tables:get-all', async () => {
            return this.getAllTables();
        });

        ipcMain.handle('tables:reload', async () => {
            return this.reloadTables();
        });

        ipcMain.handle('tables:get-by-id', async (event, id) => {
            return this.getTableByID(id);
        })

        ipcMain.handle('tables:create', async (event, display_name, seats) => {
            return this.createTable(display_name, seats);
        })

        ipcMain.handle('tables:change-status', async (event, id, new_status) => {
            return this.changeStatus(id, new_status);
        })

        ipcMain.handle('tables:update', async (event, id, display_name, seats) => {
            return this.updateTable(id, display_name, seats);
        })


    }

    // name must not be undefined, not be blank & be longer than 0 chars
    isDisplayNameValid(name) {
        return name != undefined && name.trim() != "" && name.length != 0;
    }

    // must be a valid number when parsed
    isSeatsValid(seats) {
        return !isNaN(Number(seats));
}


}

const instance = new TablesModule();
module.exports = {instance};