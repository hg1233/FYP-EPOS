class ProductsModule {
    
    netManager;
    products;
    
    constructor() {
        // current structure - { id: 1, name: 'Beer', price: 519, enabled: 1 }
        this.products = {};
        this.netManager = null;
    }

    init() {
        this.loadProducts();
    }

    async loadProducts() {
        // have to use pre-ready request as electron net not enabled until app.onReady is done
        const products = await this.netManager.pre_ready_request('/api/products/get/all');

        products.forEach(product => {
            // parse 0 & 1 as true & false
            product["enabled"] = Boolean(product["enabled"])
        })
        
        products.forEach(product => this.addProductToLocalStorage(product))
        console.log(`Loaded products (total: ${products.length}).`)
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
            
            var remoteUpdate = await this.netManager.async_post('/api/products/create', {name: product.name, price: product.price});
            
            if(remoteUpdate["message"] != undefined) {
                
                this.products[remoteUpdate.product_id] = product;
                return true;
            } else {
                return {error: "Error occurred carrying out remote update"}
            }
        } catch(err) {
            // dont add product if it fails validation
            console.debug(`Validation failed for product ID ${product.id}`)
            return;
        }
    }

    updateProduct(new_data) {
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

        var remoteUpdate = this.netManager.async_post('/api/products/update', {id: product_id, name: new_data.name, price: new_data.price});

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

        var remoteUpdate = await this.netManager.async_post(endpoint, {id: id});

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
            this.loadProducts();
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

    }


}

const instance = new ProductsModule();
module.exports = {instance};