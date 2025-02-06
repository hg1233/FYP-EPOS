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
        const products = await this.netManager.pre_ready_request('/api/products/get/all');
        // have to use pre-ready request as electron net not enabled until app.onReady is done
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

    createProduct(product) {
        try {
            this.validateProductData(product);
            
            var remoteUpdate = this.netManager.async_post('/api/products/create', {name: product.name, price: product.price});

            if(remoteUpdate["message"] != undefined) {
                this.products[product.id] = product;
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

    toggleProductStatus(id, status) {

        // check product exists
        if(!this.products[id]) {
            console.error(`Cannot update product with ID ${id} - product not found.`);
            return;
        }

        // check desired status valid
        if(typeof status != Boolean) {
            console.error(`Cannot update product with ID ${id} - invalid status defined`);
            return;
        }

        var endpoint = "";
        
        if(status == true) {
            endpoint = "/api/products/enable";
        } else {
            endpoint = "/api/products/disable";
        }

        var remoteUpdate = this.netManager.async_post(endpoint, {id: product_id});

        if(remoteUpdate["message"] != undefined) {
            this.products[product_id] = new_data;
            return true;
        } else {
            return {error: "Error occurred carrying out remote product status change"}
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
                return this.loadProducts();
            case 'TOGGLE_PRODUCT_STATUS':
                return this.toggleProductStatus(data.id, data.status);
            case 'CREATE_PRODUCT':
                return this.createProduct(data);
            default:
                console.error(`Unknown event: ${event}`)
        }
    }

    invokeIPCHandles(moduleManager, ipcMain) {
        // handle get products func from browser
        ipcMain.handle('products.get-all-products', async () => {
            var productsModule = moduleManager.instance.broadcastEvent('GET_ALL_PRODUCTS', null);
            return productsModule["products"];
        });

        // handle get product by ID func from browser
        ipcMain.handle('products.get-product-by-id', async (event, id) => {
            return this.getProductByID(id);
        })
    }


}

const instance = new ProductsModule();
module.exports = {instance};