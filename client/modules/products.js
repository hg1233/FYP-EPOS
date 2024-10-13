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
        console.log(`Loaded hardcoded products (total: ${hardcodedProducts.length()}).`)
    }

    
}