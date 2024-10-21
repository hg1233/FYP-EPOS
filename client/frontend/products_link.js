var products;

async function updateProducts() {
    var products = await window.electronAPI.products_getAllProducts();
    this.products = products;
}

updateProducts();

setTimeout(() => {
    // update products in the browser's local variable every 60 seconds
    updateProducts();
}, 60*1000);