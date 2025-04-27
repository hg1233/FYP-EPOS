class CategoriesModule {
    
    net_manager;
    categories;
    
    constructor() {
        this.categories = {};
    }

    init() {
        this.loadCategories();
    }

    async loadCategories() {
        const cats = await this.net_manager.async_get('/api/categories/get/all');

        cats.forEach(cat => {
            // parse 0 & 1 as true & false
            cat["enabled"] = Boolean(cat["enabled"]);
            // append to local storage
            this.categories[cat["id"]] = cat;
        })

        console.log(`Loaded categories (total: ${Object.keys(this.categories).length}).`)
    }

    reloadCategories() {
        this.categories = {};
        this.loadCategories();
    }

    async getAllCategories() { return this.categories; }

    async getCategoryByID(id) { return this.categories[id]; } 

    async findCategoryByName(name) {
        // iterate through local storage of cats
        for(const [cat_id, cat_data] of Object.entries(this.categories)) {
            
            // check if name matches exactly (case-sensitive)
            if(cat_data["name"] == name) {
                return cat_data;
            }
            
        }
        
        // cat not found
        return null;
    }

    async createCategory(name) {
        try {
            // input validation
            if(!this.isCatNameValid(name)) {
                return {error: "Error creating category - invalid name"}
            }
            
            var remoteUpdate = await this.net_manager.async_post('/api/categories/create', {name: name});
            
            if(remoteUpdate["message"] != undefined) {

                let cat = remoteUpdate["category_data"];

                cat.enabled = Boolean(cat.enabled)
                
                this.categories[cat["id"]] = cat;
                return cat["id"];
            } else {
                return {error: "Error occurred carrying out remote update"}
            }
        } catch(err) {
            // dont add product if it fails validation
            console.debug(`Validation failed for creating new category, error: ${err}`)
            return;
        }
    }

    async changeCatStatus(id, status) {
        // check product exists
        if(!this.categories[id]) {
            console.error(`Cannot update category with ID ${id} - category not found.`);
            return;
        }

        // check desired status is a boolean (& therefore valid)
        if(typeof status != "boolean") {
            console.error(`Cannot update category with ID ${id} - invalid status defined`);
            return;
        }

        var endpoint = "";
        
        if(status == true) {
            endpoint = "/api/categories/enable";
        } else {
            endpoint = "/api/categories/disable";
        }

        var remoteUpdate = await this.net_manager.async_post(endpoint, {id: id});

        // check if updating remote server was successsful
        if(remoteUpdate["message"] != undefined) {
            this.categories[id]["enabled"] = status;
            return true;
        } else {
            console.error("Error making remote category status update")
            console.error(remoteUpdate)
            return null;
        }
    }

    async changeCatName(id, name) {

        if(!this.isCatIDValid(id)) {
            console.error(`Cannot update category with ID ${id} - category not found.`);
            return;
        }

        if(!this.isCatNameValid(name)) {
            console.error(`Cannot update category with ID ${id} - category data invalid.`);
            return;
        }

        var remoteUpdate = await this.net_manager.async_post(`/api/categories/${id}/name`, {name: name});

        if(remoteUpdate["message"] != undefined) {
            this.categories[id]["name"] = name;
            return true;
        } else {
            return {error: "Error occurred carrying out remote category name change"}
        }


    }

    async changeCatPriority(id, priority) {

        if(!this.isCatIDValid(id)) {
            console.error(`Cannot update category with ID ${id} - category not found.`);
            return;
        }

        if(!this.isPriorityValid(priority)) {
            console.error(`Cannot update category with ID ${id} - category data invalid.`);
            return;
        }

        var remoteUpdate = await this.net_manager.async_post(`/api/categories/${id}/priority`, {priority: priority});

        if(remoteUpdate["message"] != undefined) {
            this.categories[id]["priority"] = priority;
            return true;
        } else {
            return {error: "Error occurred carrying out remote category priority change"}
        }


    }

    async isCatIDValid(id) {
        return this.categories[id]
    }
    
    isCatNameValid(name) {
       return name != undefined && name.trim() != ""
    }
    
    isPriorityValid(input) {
        return input != undefined && !isNaN(input) && isFinite(input)
    }
    
    invokeIPCHandles(moduleManager, ipcMain) {
        
        ipcMain.handle('categories:get-all-categories', async () => {
            return this.getAllCategories();
        });
        
        ipcMain.handle('categories:get-category-by-id', async (event, id) => {
            return this.getCategoryByID(id);
        })

        ipcMain.handle('categories:get-category-by-name', async (event, name) => {
            return this.findCategoryByName(name);
        })
       
        ipcMain.handle('categories:reload', async () => {
            return this.reloadCategories();
        })

        ipcMain.handle('categories:change-status', async (event, id, new_status) => {
            return this.changeCatStatus(id, new_status);
        })

        ipcMain.handle('categories:change-name', async (event, id, name) => {
            return this.changeCatName(id, name);
        })

        ipcMain.handle('categories:change-priority', async (event, id, priority) => {
            return this.changeCatPriority(id, priority);
        })

        ipcMain.handle('categories:create', async (event, name) => {
            return this.createCategory(name)
        })

    }

}


const instance = new CategoriesModule();
module.exports = {instance};