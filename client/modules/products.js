class ProductsModule {
    
    constructor() {
        this.products = {};
    }

    init() {
        this.loadProducts();
    }

    loadProducts() {
        // TODO - replace this with a web callout (maybe web requests / api access as separate module?)
        const hardcodedProducts = [
            {"id": 1, "name": "Pint of Beer", "price": 450},
            {"id": 2, "name": "Half Pint of Beer", "price": 240},
            {"id": 3, "name": "Pint of Water", "price": 120},
        ]
        hardcodedProducts.forEach(product => this.addProduct(product));
        console.log(`Loaded hardcoded products (total: ${hardcodedProducts.length}).`)
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
            this.products[product.id] = product;
        } catch(err) {
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
            default:
                console.error(`Unknown event: ${event}`)
        }
    }


}

const instance = new ProductsModule();
module.exports = {instance};