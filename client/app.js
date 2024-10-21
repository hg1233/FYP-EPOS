const { app, BrowserWindow, ipcMain } = require('electron/main'); // import electron &  required options

// enable automated testing bridge
// TODO - improve this conditional logic
if (process.env.TEST != undefined) {
    require('wdio-electron-service/main')
}


// import & setup window manager
const windowManager = require("./managers/window_manager.js");
windowManager.init();

// import module manager
const moduleManager = require("./managers/module_manager.js");

// register products module
moduleManager.instance.registerModule('products', require('./modules/products.js').instance)


app.whenReady().then( () => {

    // open first screen
    windowManager.instance.launch();

    ipcMain.on('winmngr.show-page', (event, page_name) => {
        var page = windowManager.instance.getPageByName(page_name)
        windowManager.instance.showPage(page);
    });

    // handle get products func from browser
    ipcMain.handle('products.get-all-products', async () => {
        var productsModule = moduleManager.instance.broadcastEvent('GET_ALL_PRODUCTS', null);
        return productsModule["products"];
    });

    setTimeout(function() {
        var productsModule = moduleManager.instance.getModuleByName('products');
        productsModule.addProduct({"id": 4, "name": "Pint of Cider", "price": 550});
    }, 10*1000)

});
