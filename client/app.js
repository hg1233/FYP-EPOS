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

let modules = [
    {name: 'products', path: './modules/products.js'},
    {name: 'categories', path: './modules/categories.js'},
    {name: 'clerks', path: './modules/clerks.js'},
    {name: 'venue', path: './modules/venue.js'},
    {name: 'payment_methods', path: './modules/payment_methods.js'},
    {name: 'tables', path: './modules/tables.js'},
    {name: 'orders', path: './modules/orders.js'},
    {name: 'printing', path: './modules/printing.js'},
]

// register all modules
modules.forEach(module => {
    try {
        let module_obj = require(module.path).instance
        module_obj.net_manager = netManager;
        moduleManager.instance.registerModule(module.name, module_obj)
    } catch(err) {
        console.error(`Failed to initalise network manager for module '${module.name}':`)
        console.error(err)
    }
});

app.whenReady().then( () => {

    // invoke & setup handles for client backend, server backend & client frontend data transfer
    modules.forEach(module => {
        try {
            let module_obj = moduleManager.instance.getModuleByName(module.name)
            module_obj.invokeIPCHandles(moduleManager, ipcMain)
        } catch(err) {
            console.error(`Failed to invoke IPC handles for module '${module.name}':`)
            console.error(err);
        }

    });

    // open first screen
    windowManager.instance.launch();

    ipcMain.on('winmngr:show-page', (event, page_name) => {
        var page = windowManager.instance.getPageByName(page_name)
        windowManager.instance.showPage(page);
    });


});
