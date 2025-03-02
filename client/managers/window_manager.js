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
        //this.window.setMenu(null);

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

    test_page2 = new Page("Test2", "templates/test2.html");
    instance.addPage(test_page2);

    manager_settings_page = new Page("Manager Settings", "templates/manager_settings.html")
    instance.addPage(manager_settings_page);

    manage_categories_page = new Page("Manage Categories", "templates/manage_categories.html");
    instance.addPage(manage_categories_page);

    manage_clerks_page = new Page("Manage Clerks", "templates/manage_clerks.html");
    instance.addPage(manage_clerks_page);

    manage_clerks_page = new Page("Manage Tables", "templates/manage_tables.html");
    instance.addPage(manage_clerks_page);

    manage_venue_page = new Page("Manage Venue", "templates/manage_venue.html");
    instance.addPage(manage_venue_page);

    manage_products_page = new Page("Manage Products", "templates/manage_products.html");
    instance.addPage(manage_products_page);

    // setup clerk login page
    clerk_login_page = new Page("Clerk Login", "templates/clerk_login.html");
    instance.addPage(clerk_login_page);
    instance.setDefaultPage(clerk_login_page);


}

module.exports = {init, instance}