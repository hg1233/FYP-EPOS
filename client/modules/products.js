class ProductsModule {
    
    netManager;
    products;
    
    constructor() {
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
            // TODO - replace with remote update on server, then update locally also
            this.products[product.id] = product;
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

        // TODO - replace with remote update on server, then update locally also
        this.products[product_id] = new_data;
    }

    getAllProducts() { return this.products; }


    getProductByID(id) { 
        return this.products[id];
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
            default:
                console.error(`Unknown event: ${event}`)
        }
    }


}

const instance = new ProductsModule();
module.exports = {instance};