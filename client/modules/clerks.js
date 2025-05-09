class ClerksModule {

    net_manager;
    current_clerk;
    clerks;

    constructor() {
        this.current_clerk = null;
        this.net_manager = null;
        this.clerks = {};
    }

    init() {
        this.cacheClerks();
    }

    async cacheClerks() {
        var clerks = await this.net_manager.async_get('/api/clerks/get/all');

        clerks.forEach(clerk => {
            // parse 0 & 1 as true & false
            clerk["enabled"] = Boolean(clerk["enabled"])
            clerk["is_manager"] = Boolean(clerk["is_manager"])
            // convert api data into local array - organised by ID #
            this.addClerkToLocalCache(clerk)
        })

        console.log(`Loaded clerks (total: ${Object.keys(this.clerks).length}).`)
    }

    async addClerkToLocalCache(clerk) {
        try {
            this.validateClerkData(clerk);
            this.clerks[clerk.id] = clerk;
        } catch(err) {
            // dont add clerk if they fail validation
            return;
        }
    }

    validateClerkData(clerk) {
        // check core clerk info supplied
        if(typeof clerk.id != "number" || !clerk.name || typeof clerk.pin !== "string"){ 
            throw new Error("Invalid clerk data.");
        }
        
    }

    async findClerkByPIN(pin) {
        // iterate through local storage of clerks
        for(const [clerk_id, clerk_data] of Object.entries(this.clerks)) {
            
            if(clerk_data["pin"] == pin) {
                return clerk_data;
            }
            
        }
        
        // clerk not found
        return null;
    }

    async createClerk(clerk) {
        try {

            // used as placeholder for validation in next line
            clerk.id = -999;

            this.validateClerkData(clerk);
            
            var remoteUpdate = await this.net_manager.async_post('/api/clerks/create', {name: clerk.name, pin: clerk.pin});
            
            if(remoteUpdate["message"] != undefined) {
                
                // replace placeholder with actual ID value
                clerk.id = remoteUpdate.clerk_id;

                this.clerks[remoteUpdate.clerk_id] = clerk;
                return clerk.id;
            } else {
                return {error: "Error occurred carrying out remote update", details: remoteUpdate["error"]}
            }
        } catch(err) {
            // dont add clerk if it fails validation
            console.debug(`Error occurred adding new clerk: ${err}`)
            return;
        }
    }

    async reloadClerks() {
        this.clerks = {};
        await this.cacheClerks();
        return this.clerks;
    }

    async changeClerkStatus(id, status) {

        // check clerk exists
        if(!this.clerks[id]) {
            console.error(`Cannot update status of clerk with ID ${id} - clerk not found.`);
            return;
        }

        // check desired status is a boolean (& therefore valid)
        if(typeof status != "boolean") {
            console.error(`Cannot update clerk with ID ${id} - invalid status defined`);
            return;
        }

        var endpoint = "";
        
        if(status == true) {
            endpoint = "/api/clerks/enable";
        } else {
            endpoint = "/api/clerks/disable";
        }

        var remoteUpdate = await this.net_manager.async_post(endpoint, {id: id});

        // check if updating remote server was successsful
        if(remoteUpdate["message"] != undefined) {
            this.clerks[id]["enabled"] = status;
            return true;
        } else {
            console.error("Error making remote clerk status update")
            console.error(remoteUpdate)
            return null;
        }

    }

    async updateClerk(new_data) {

        // parse to number
        new_data["id"] = Number(new_data["id"]);

        var clerk_id = new_data["id"]

        if(!this.clerks[clerk_id]) {
            console.error(`Cannot update clerk with ID ${clerk_id} - clerk not found.`);
            return;
        }

        try {
            this.validateClerkData(new_data);
        } catch(error) {
            console.error(`Cannot update clerk with ID ${clerk_id} - clerk data invalid.`);
            return;
        }

        var remoteUpdate = await this.net_manager.async_post('/api/clerks/update', {id: clerk_id, name: new_data.name, pin: new_data.pin});

        if(remoteUpdate["message"] != undefined) {
            // parse boolean int values 0 & 1 to true/false
            remoteUpdate["new_data"]["enabled"] = Boolean(remoteUpdate["new_data"]["enabled"]);
            this.clerks[clerk_id] = remoteUpdate["new_data"];
            return true;
        } else {
            console.debug(remoteUpdate)
            return {error: "Error occurred carrying out remote clerk update"}
        }
    }

    async changeRole(id, new_role) {

        var clerk_id = Number(id);

        if(!this.clerks[clerk_id]) {
            console.error(`Cannot update role of clerk with ID ${clerk_id} - clerk not found.`);
            return;
        }

        var remoteUpdate = await this.net_manager.async_post('/api/clerks/manager', {id: clerk_id, is_manager: new_role});

        if(remoteUpdate["message"] != undefined) {
            // parse boolean int values 0 & 1 to true/false
            remoteUpdate["is_manager"] = Boolean(remoteUpdate["is_manager"]);
            this.clerks[clerk_id]["is_manager"] = remoteUpdate["is_manager"];
            return true;
        } else {
            console.debug(remoteUpdate)
            return {error: "Error occurred carrying out remote clerk role change"}
        }
    }

    // used as login func
    async setCurrentClerk(id) {

        var clerk_id = Number(id);

        if(!this.clerks[clerk_id]) {
            console.error(`Cannot set current clerk to ID ${clerk_id} - clerk not found.`);
            return false;
        }

        this.current_clerk = this.clerks[clerk_id];
        return true;

    }

    // used as logout func
    async removeCurrentClerk() {
        this.current_clerk = null;
    }

    invokeIPCHandles(moduleManager, ipcMain) {
        
        // get all clerks
        ipcMain.handle('clerks:get-all-clerks', async () => {
            return this.clerks;
        });

        // get all clerks
        ipcMain.handle('clerks:get-clerk-by-id', async (event, id) => {
            return this.clerks[id];
        });

        // find clerk by PIN #
        ipcMain.handle('clerks:get-clerk-by-pin', async (event, pin) => {
            return this.findClerkByPIN(pin);
        });

        // create clerk
        ipcMain.handle('clerks:create-clerk', async (event, clerk_data) => {
            return this.createClerk(clerk_data);
        });

        // reload clerks
        ipcMain.handle('clerks:reload-clerks', async (event, clerk_data) => {
            return this.reloadClerks();
        });

        // change clerk status
        ipcMain.handle('clerks:change-clerk-status', async (event, clerk_id, status) => {
            return this.changeClerkStatus(clerk_id, status)
        })

        // update clerk
        ipcMain.handle('clerks:update-clerk', async (event, new_data) => {
            return this.updateClerk(new_data)
        })

        // change role
        ipcMain.handle('clerks:change-role', async (event, id, new_role) => {
            return this.changeRole(id, new_role)
        })

        // login (set current clerk)
        ipcMain.handle('clerks:login', async (event, clerk_id) => {
            return this.setCurrentClerk(clerk_id);
        });
        
        // logout (clear current clerk)
        ipcMain.handle('clerks:logout', async (event) => {
            return this.removeCurrentClerk();
        });

        // get current clerk
        ipcMain.handle('clerks:get-current', async (event) => {
            return this.current_clerk;
        })
    }
    
}

const instance = new ClerksModule();
module.exports = {instance};