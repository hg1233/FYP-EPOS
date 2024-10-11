const { BrowserWindow } = require("electron/main");

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

    addPage(page) { this.available_pages.push(page); }

    getAllPages() { return this.available_pages; }

    launch() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
        });

        // make window take up all screen space
        this.window.setFullScreen(true);

        // load default page
        this.window.loadFile(this.getDefaultPage().page_file);
    }

}

class Page {
    constructor(page_name, page_file) {
        this.page_name = page_name;
        this.page_file = page_file;
    }
}

const pm = new PageManager()

function init() {

    // create test hello world page and add to page manager
    test_page = new Page("Test", "templates/test.html");
    pm.addPage(test_page);
    pm.setDefaultPage(test_page);


}

module.exports = {init, pm}