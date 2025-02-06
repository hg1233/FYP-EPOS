var products;

async function updateProducts() {
    var products = await window.electronAPI.products_getAllProducts();
    this.products = products;
}

async function getProductByID(id) {
    var product = await window.electronAPI.products_getProductByID(id);
    return product;
    var product = null;
    promise.then(response => { product = response; })
    return product;
}

updateProducts();

setTimeout(() => {
    // update products in the browser's local variable every 60 seconds
    updateProducts();
}, 60*1000);