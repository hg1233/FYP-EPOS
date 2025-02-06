var products;

async function updateProducts() {
    var products = await window.electronAPI.products_reloadProducts();
    this.products = products;
}

async function getAllProducts() {
    return await window.electronAPI.products_getAllProducts();
}

async function getProductByID(id) {
    return await window.electronAPI.products_getProductByID(id);
}

updateProducts();

setTimeout(() => {
    // update products in the browser's local variable every 60 seconds
    updateProducts();
}, 60*1000);