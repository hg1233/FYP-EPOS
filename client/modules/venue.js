class VenueModule {

    venue_info;
    net_manager;

    constructor() {
        this.venue_info = {};
    }

    init() {
        this.loadVenueData();
    }

    async loadVenueData() {
        var data = await this.net_manager.async_get('/api/venue/get/all');
        data.forEach(entry => {
            this.venue_info[entry["attribute"]] = entry["value"];
        });
        console.log(`Loaded venue data (total attributes: ${Object.keys(this.venue_info).length}).`)
    }

    async reloadVenueData() {
        this.venue_info = {};
        this.loadVenueData();
    }

    async getAllVenueInfo() {
        return this.venue_info;
    }

    async getValue(attribute) {
        return this.venue_info[attribute];
    }

    async addAttribute(attribute, value) {
        try {

            this.validateAttributeName(attribute);

            var remoteUpdate = await this.net_manager.async_post('/api/venue/add', {attribute: attribute, value: value});
            
            if(remoteUpdate["message"] != undefined) {
                  this.venue_info[remoteUpdate["venue_data"]["attribute"]] = remoteUpdate["venue_data"]["value"];
                return true;
            } else {
                return {error: "Error occurred carrying out remote update", details: remoteUpdate["error"]}
            }
        } catch(err) {
            // dont add clerk if it fails validation
            console.debug(`Error occurred adding venue attribute: ${err}`)
            return;
        }
    }

    async updateAttribute(attribute, new_value) {
        try {
            
            // check atribute exists
            if(!this.venue_info[attribute]) {
                console.error(`Cannot update venue attribute with name ${attribute} - attribute not found.`);
                return;
            }
            var remoteUpdate = await this.net_manager.async_post('/api/venue/update', {attribute: attribute, value: new_value});
            
            if(remoteUpdate["message"] != undefined) {
                  this.venue_info[attribute] = remoteUpdate["new_value"];
                return true;
            } else {
                return {error: "Error occurred carrying out remote update", details: remoteUpdate["error"]}
            }


        } catch(err) {
            console.debug(`Error occurred updating venue attribute: ${err}`)
            return;
        }
    }

    validateAttributeName(name) {
        return name != undefined && name.trim() != ""
    }

    invokeIPCHandles(moduleManager, ipcMain) {

        // get all venue info
        ipcMain.handle('venue:get-all-info', async () => {
            return this.venue_info;
        });

        // get venue info by attribute
        ipcMain.handle('venue:get-info-by-attribute', async (event, attribute) => {
            return this.getValue(attribute)
        });

        // reload venue info
        ipcMain.handle('venue:reload', async () => {
            return this.reloadVenueData();
        });

        // add new venue attribute
        ipcMain.handle('venue:add-attribute', async (event, attribute, value) => {
            return this.addAttribute(attribute, value);
        });

        // update existing venue attribute
        ipcMain.handle('venue:update-attribute', async (event, attribute, value) => {
            return this.updateAttribute(attribute, value);
        });


    }

}

const instance = new VenueModule();
module.exports = {instance};