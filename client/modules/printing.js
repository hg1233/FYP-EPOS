class PrintingModule {

    net_manager;
    is_printing_enabled;
    available_printers;
    receipt_printer;
    kitchen_printer;

    constructor() {
        this.available_printers = [];
        this.receipt_printer = null;
        this.kitchen_printer = null;
    }

    /**
     * Printer data must be imported by the browser window.
     * This function is used to load the data so that the app can use the active printer data.
     * 
     * @param {*} printer_data 
     */
    async loadPrinters(printer_data) {
        // TODO
    }

    async setKitchenPrinter(printer) {
        // TODO
    }

    async setReceiptPrinter(printer) {
        // TODO
    }

    async printToKitchen(data) {

        if(!this.is_printing_enabled) {
            console.info("Kitchen receipt not printed - printing is disabled.");
            return;
        }

        if(this.kitchen_printer == null) {
            console.warn("Unable to print to kitchen printer - printer not setup.")
            return;
        }

        // TODO
    }

    async printToReceipt(data) {

        if(!this.is_printing_enabled) {
            console.info("Receipt not printed - printing is disabled.");
            return;
        }

        if(this.kitchen_printer == null) {
            console.warn("Unable to print to receipt printer - printer not setup.")
            return;
        }

        // TODO
    }

    async invokeIPCHandles(moduleManager, ipcMain) {
    
        ipcMain.handle('print:load-printers', async (event, printer_data) => {
            this.loadPrinters(printer_data);
        })

        ipcMain.handle('print:get-kitchen-printer', async () => {
            return this.kitchen_printer;
        })
        
        ipcMain.handle('print:get-receipt-printer', async () => {
            return this.receipt_printer;
        })

    }

}

let instance = new PrintingModule();
module.exports = instance;