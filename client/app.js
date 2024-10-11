const { app } = require('electron/main'); // import electron

// enable automated testing bridge
if (process.env.TEST != undefined) {
    require('wdio-electron-service/main')
}


// import & setup window manager
const windowManager = require("./window_manager.js");
windowManager.init();


app.whenReady().then( () => {

    // open first screen
    windowManager.pm.launch();

    setTimeout(function() {
        windowManager.pm.showPage(windowManager.pm.getPageByName("Test2"));
    }, 5000);

});
