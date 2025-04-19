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

    closeWindow() {
        this.window.destroy();
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

    let pages = [
        {name: 'Test', path: 'templates/test.html'},
        {name: 'Nav', path: 'templates/nav.html'},
        {name: 'Sale', path: 'templates/sale.html'},
        {name: 'View Tables', path: 'templates/view_tables.html'},
        {name: 'Manager Settings', path: 'templates/manager_settings.html'},
        {name: 'Manage Clerks', path: 'templates/manage_clerks.html'},
        {name: 'Manage Tables', path: 'templates/manage_tables.html'},
        {name: 'Manage Venue', path: 'templates/manage_venue.html'},
        {name: 'Manage Products', path: 'templates/manage_products.html'},
        {name: 'Manage Categories', path: 'templates/manage_categories.html'},
        {name: 'Manage Printing', path: 'templates/manage_printing.html'},
        {name: 'Clerk Login', path: 'templates/clerk_login.html', default: true},
    ]
    
    // register all pages
    pages.forEach(page => {
        try {
            let page_obj = new Page(page.name, page.path)
            instance.addPage(page_obj);
            
            // null & undefined check to prevent checking if non-existent var is true, throws err
            if(page.default != undefined && page.default != null) {

                // page.default exists, but first check its true
                if(page.default == true) instance.setDefaultPage(page_obj);

            }

        } catch(err) {
            console.error(`Failed to register page '${page.name}':`)
            console.error(err)
        }
    });

    console.log(`Registered ${instance.available_pages.length} pages successfully.`)

}

module.exports = {init, instance}