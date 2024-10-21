var products;

async function getAllProducts() {
    const body = document.getElementsByTagName('body')[0];
    var products = await window.electronAPI.products_getAllProducts();
    this.products = products;

    for(var x = 1; x <= Object.entries(products).length; x++) {
        body.innerHTML = body.innerHTML + products[x].name + "<br>";
    }
}

getAllProducts();
