const { BrowserWindow } = require("electron/main");
const path = require('path');

class PageManager {
    constructor() {
        this.available_pages = [];
        this.default_page = null;
        this.currently_active_page = null;
        this.window = null;
    }

    // Getters & Setters for default & active page variables

    getDefaultPage() { return this.default_page; }
    
    setDefaultPage(page) { this.default_page = page; }

    getActivePage() { return this.currently_active_page; }

    setActivePage(page) { this.currently_active_page = page; }

    addPage(page) { 

        // check if page already exists
        if(this.getPageByName(page.page_name) !== undefined) {
            throw new Error("A page with that name already exists.")
        }
        
        this.available_pages.push(page);
    
    }

    getAllPages() { return this.available_pages; }

    getPageByName(name) {
        return this.available_pages.find(page => page.page_name == name);
    }

    showPage(page) {
        if(this.window == null) { return null; } // ensure window has been initalised
        if(page == null) { return null; } // ensure page is defined

        this.window.loadFile(page.page_file);
        this.setActivePage(page);
        return 1;
        
    }

    launch() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, '..', 'preload.js'),
                sandbox: false,
                contextIsolation: true,
                nodeIntegration: false,
            }
        });

        // make window take up all screen space
        this.window.setFullScreen(true);

        // disable top menu bar
        this.window.setMenu(null);

        // load default page
        this.showPage(this.getDefaultPage());

    }

}

class Page {
    constructor(page_name, page_file) {
        this.page_name = page_name;
        this.page_file = page_file;
    }
}

const instance = new PageManager()

function init() {

    // create test hello world page and add to page manager
    test_page = new Page("Test", "templates/test.html");
    instance.addPage(test_page);
    instance.setDefaultPage(test_page);

    test_page = new Page("Test2", "templates/test2.html");
    instance.addPage(test_page);


}

module.exports = {init, instance}