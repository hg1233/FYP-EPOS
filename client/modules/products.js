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
        products.forEach(product => this.addProduct(product))
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

    addProduct(product) {
        try {
            this.validateProductData(product);
            
            var remoteUpdate = this.netManager.async_post('/api/products/create', {name: product.name, price: product.price});

            if(remoteUpdate["message"] != undefined) {
                this.products[product_id] = product;
            } else {
                return {error: "Error occurred carrying out remote update"}
            }
        } catch(err) {
            // dont add product if it fails validation
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
        } else {
            return {error: "Error occurred carrying out remote update"}
        }
    }

    getAllProducts() { return this.products; }


    getProductByID(id) { 
        return this.products[id];
    }

    createProduct(product_data) {
        // TODO
    }

    toggleProductStatus(id, status) {
        // TODO
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


}

const instance = new ProductsModule();
module.exports = {instance};