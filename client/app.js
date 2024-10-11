const { app } = require('electron/main'); // import electron

// import & setup window manager
const windowManager = require("./window_manager.js");
windowManager.init();


app.whenReady().then( () => {

    // open first screen
    windowManager.pm.launch();

});
