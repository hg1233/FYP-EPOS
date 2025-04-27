class ProductsModule {
    
    net_manager;
    products;
    module_manager;
    
    constructor() {
        // current structure - { id: 1, name: 'Beer', price: 519, enabled: 1 }
        this.products = {};
        this.net_manager = null;
        this.module_manager = null;
    }

    init() {
        this.loadProducts();
    }

    async loadProducts() {
        // have to use pre-ready request as electron net not enabled until app.onReady is done
        const products = await this.net_manager.async_get('/api/products/get/all');

        products.forEach(product => {
            // parse 0 & 1 as true & false
            product["enabled"] = Boolean(product["enabled"])
            this.addProductToLocalStorage(product)
        })
        
        console.log(`Loaded products (total: ${Object.keys(this.products).length}).`)
    }

    validateProductData(product) {
        // check core product info supplied
        if(!product.id || !product.name || typeof product.price !== 'number') {
            throw new Error("Invalid product data.");
        }
        // check price is not negative
        if(product.price < 0) {
            throw new Error("Product price cannot be a negative number.");
        }
    }

    addProductToLocalStorage(product) {
        try {
            this.validateProductData(product);
            this.products[product.id] = product;
        } catch(err) {
            // dont add product if it fails validation
            return;
        }
    }

    async createProduct(product) {
        try {

            // used as placeholder for validation in next line
            product.id = -999;

            this.validateProductData(product);
            
            var remoteUpdate = await this.net_manager.async_post('/api/products/create', {name: product.name, price: product.price});
            
            if(remoteUpdate["message"] != undefined) {
                
                this.products[remoteUpdate.product_id] = product;
                return remoteUpdate.product_id;
            } else {
                return {error: "Error occurred carrying out remote update"}
            }
        } catch(err) {
            // dont add product if it fails validation
            console.debug(`Validation failed for product ID ${product.id}`, err)
            return;
        }
    }

    async updateProduct(new_data) {
        var product_id = new_data.id;

        if(!this.products[product_id]) {
            console.error(`Cannot update product with ID ${product_id} - product not found.`);
            return;
        }

        try {
            this.validateProductData(new_data);
        } catch(error) {
            console.error(`Cannot update product with ID ${product_id} - product data invalid.`);
            return;
        }

        var remoteUpdate = await this.net_manager.async_post('/api/products/update', {id: product_id, name: new_data.name, price: new_data.price});

        if(remoteUpdate["message"] != undefined) {
            this.products[product_id] = new_data;
            return true;
        } else {
            return {error: "Error occurred carrying out remote product update"}
        }
    }

    getAllProducts() { return this.products; }


    getProductByID(id) { 
        return this.products[id];
    }

    async getProductByIDFromServer(id) {
        return await this.net_manager.async_get(`/api/products/get/${id}`);
    }

    async changeProductStatus(id, status) {

        // check product exists
        if(!this.products[id]) {
            console.error(`Cannot update product with ID ${id} - product not found.`);
            return;
        }

        // check desired status is a boolean (& therefore valid)
        if(typeof status != "boolean") {
            console.error(`Cannot update product with ID ${id} - invalid status defined`);
            return;
        }

        var endpoint = "";
        
        if(status == true) {
            endpoint = "/api/products/enable";
        } else {
            endpoint = "/api/products/disable";
        }

        var remoteUpdate = await this.net_manager.async_post(endpoint, {id: id});

        // check if updating remote server was successsful
        if(remoteUpdate["message"] != undefined) {
            this.products[id]["enabled"] = status;
            return true;
        } else {
            console.error("Error making remote product status update")
            console.error(remoteUpdate)
            return null;
        }

    }
    
    handleEvent(event, data) {
        switch(event) {
            case 'GET_PRODUCT':
                return this.getProductByID(data.id);
            case 'GET_ALL_PRODUCTS':
                return this.getAllProducts(); 
            case 'RELOAD_PRODUCTS':
                this.products = {}; // clear 1st before reloading
                this.loadProducts();
                return this.getAllProducts();
            case 'CHANGE_PRODUCT_STATUS':
                return this.changeProductStatus(data.id, data.status);
            case 'CREATE_PRODUCT':
                return this.createProduct(data);
            default:
                console.error(`Unknown event: ${event}`)
        }
    }

    invokeIPCHandles(moduleManager, ipcMain) {

        this.module_manager = moduleManager;

        // handle get products func from browser
        ipcMain.handle('products:get-all-products', async () => {
            return this.getAllProducts();
        });

        // handle get product by ID func from browser
        ipcMain.handle('products:get-product-by-id', async (event, id) => {
            return this.getProductByID(id);
        })

        // handle reload products func from browser
        ipcMain.handle('products:reload-products', async () => {
            this.products = {}; // clear 1st before reloading
            await this.loadProducts();
            return this.getAllProducts();
        })

        // handle product toggle status func from browser
        ipcMain.handle('products:change-status', async (event, id, new_status) => {
            return this.changeProductStatus(id, new_status);
        })

        // handle create product func from browser
        ipcMain.handle('products:create-product', async (event, product_data) => {
            return this.createProduct(product_data)
        })

        ipcMain.handle('products:update-product', async (event, product_data) => {
            return this.updateProduct(product_data)
        })

        ipcMain.handle('products:create-cat-link', async (event, product_id, category_id) => {
            return this.createCategoryLink(product_id, category_id);
        })

        ipcMain.handle('products:remove-cat-link', async (event, product_id, category_id) => {
            return this.removeCategoryLink(product_id, category_id);
        })

    }

    async createCategoryLink(product_id, category_id) {
        
        // check product id valid
        if(!this.products[product_id]) {
            console.error(`Cannot create category link for product ID # '${product_id}' - product not found.`);
            return {error: "Product ID not found"};
        }

        // check category id valid
        if(!this.module_manager.instance.modules.categories.getCategoryByID(category_id)) {
            console.error(`Cannot create category link for product ID # ${product_id} - category ID # '${category_id}' not found.`);
            return {error: "Category ID not found"};
        }

        // check if link already exists
        if(this.products[product_id].categories !== null) {
            if(this.products[product_id].categories.includes(category_id.toString())) {
                console.error(`Cannot remove category link for product # ${product_id} and category # ${category_id} - link already exists.`);
                return {error: "Link already exists"};
            }
        }

        var remoteUpdate = await this.net_manager.async_post('/api/cat_link/create', {product_id: product_id, category_id: category_id});

        if(remoteUpdate["message"] != undefined) {
            this.products[product_id] = await this.getProductByIDFromServer(product_id);
            return true;
        } else {
            return {error: "Error occurred carrying out remote category product link update", debug: remoteUpdate}
        }

    }

    async removeCategoryLink(product_id, category_id) {
        
        // check product id valid
        if(!this.products[product_id]) {
            console.error(`Cannot remove category link for product ID # '${product_id}' - product not found.`);
            return {error: "Product ID not found"};
        }

        // check category id valid
        if(!this.module_manager.instance.modules.categories.getCategoryByID(category_id)) {
            console.error(`Cannot remove category link for product ID # ${product_id} - category ID # '${category_id}' not found.`);
            return {error: "Category ID not found"};
        }

        // check link exists    
        if(this.products[product_id].categories == null || !this.products[product_id].categories.includes(category_id.toString())) {
            console.error(`Cannot remove category link for product # ${product_id} and category # ${category_id} - link does not exist.`);
            return {error: "Link does not exist"};
        }
        
        var remoteUpdate = await this.net_manager.async_post('/api/cat_link/remove', {product_id: product_id, category_id: category_id});

        if(remoteUpdate["message"] != undefined) {
            this.products[product_id] = await this.getProductByIDFromServer(product_id);
            return true;
        } else {
            return {error: "Error occurred carrying out remote category product link update", debug: remoteUpdate}
        }

    }


}

const instance = new ProductsModule();
module.exports = {instance};