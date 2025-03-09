var products;

async function updateProducts() {
    var result = await window.electronAPI.products_reloadProducts();
    products = result;
}

async function getAllProducts() {
    return await window.electronAPI.products_getAllProducts();
}

async function getProductByID(id) {
    return await window.electronAPI.products_getProductByID(id);
}

async function changeProductStatus(id, new_status) {
    let result = await window.electronAPI.products_changeStatus(id, new_status);
    await updateProducts();
    return result;
}

async function createProduct(name, price) {
    let result = await window.electronAPI.products_createProduct({name: name, price: price})
    await updateProducts();
    return result;
}

async function updateProductData(id, name, price) {
    await window.electronAPI.products_updateProduct({id: id, name: name, price: price});
    await updateProducts();
}

async function createCategoryProductLink(product_id, category_id) {
    let result = await window.electronAPI.products_createCategoryLink(product_id, category_id);
    await window.electronAPI.categories_reload();
    return result;
}

async function removeCategoryProductLink(product_id, category_id) {
    let result = await window.electronAPI.products_removeCategoryLink(product_id, category_id);
    await window.electronAPI.categories_reload();
    return result;
}


updateProducts();

setTimeout(() => {
    // update products in the browser's local variable every 60 seconds
    updateProducts();
}, 60*1000);