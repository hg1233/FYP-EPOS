const { app, BrowserWindow, ipcMain } = require('electron/main'); // import electron &  required options

// enable automated testing bridge
if (process.env.TEST != undefined) {
    require('wdio-electron-service/main')
}


// import & setup window manager
const windowManager = require("./managers/window_manager.js");
windowManager.init();

// import module manager
const moduleManager = require("./managers/module_manager.js");

// import network manager
const netManager = require("./managers/net_manager.js").instance;

// register products module
var products_module = require('./modules/products.js').instance
products_module.netManager = netManager;
moduleManager.instance.registerModule('products', products_module)

// register categories module
var cats_module = require('./modules/categories.js').instance
cats_module.net_manager = netManager;
moduleManager.instance.registerModule('categories', cats_module)

// register clerks module
var clerks_module = require('./modules/clerks.js').instance
clerks_module.net_manager = netManager;
moduleManager.instance.registerModule('clerks', clerks_module)

// register clerks module
var venue_module = require('./modules/venue.js').instance
venue_module.net_manager = netManager;
moduleManager.instance.registerModule('venue', venue_module)

app.whenReady().then( () => {

    // open first screen
    windowManager.instance.launch();

    ipcMain.on('winmngr:show-page', (event, page_name) => {
        var page = windowManager.instance.getPageByName(page_name)
        windowManager.instance.showPage(page);
    });

    // invoke & setup handles for client backend, server backend & client frontend data transfer
    products_module.invokeIPCHandles(moduleManager, ipcMain);
    clerks_module.invokeIPCHandles(moduleManager, ipcMain);
    venue_module.invokeIPCHandles(moduleManager, ipcMain);
    cats_module.invokeIPCHandles(moduleManager, ipcMain);

});
