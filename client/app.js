const { app } = require('electron/main'); // import electron

// enable automated testing bridge
// TODO - improve this conditional logic
if (process.env.TEST != undefined) {
    require('wdio-electron-service/main')
}


// import & setup window manager
const windowManager = require("./managers/window_manager.js");
windowManager.init();

// import & setup module manager
const moduleManager = require("./managers/module_manager.js");
moduleManager.init();


app.whenReady().then( () => {

    // open first screen
    windowManager.instance.launch();

    setTimeout(function() {
        windowManager.instance.showPage(windowManager.instance.getPageByName("Test2"));
    }, 5000);

});
