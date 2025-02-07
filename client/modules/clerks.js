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
        var clerks = await this.net_manager.pre_ready_request('/api/clerks/get/all');
        // convert api data into local array - organised by ID #
        clerks.forEach(clerk => this.addClerkToLocalCache(clerk))
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
            throw new Error("Invalid product data.");
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

    invokeIPCHandles(moduleManager, ipcMain) {
        
        // get all clerks
        ipcMain.handle('clerks:get-all-clerks', async () => {
            return this.clerks;
        });

        // get all clerks
        ipcMain.handle('clerks:get-clerk-by-id', async (event, id) => {
            console.debug("clerk ID:", id)
            return this.clerks[id];
        });

        // find clerk by PIN #
        ipcMain.handle('clerks:get-clerk-by-pin', async (event, pin) => {
            return this.findClerkByPIN(pin);
        });
    }
    
}

const instance = new ClerksModule();
module.exports = {instance};