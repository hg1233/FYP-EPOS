class PrintingModule {

    net_manager;
    is_printing_enabled;
    available_printers;
    receipt_printer;
    kitchen_printer;
    printing_type;

    constructor() {
        this.available_printers = [];
        this.receipt_printer = null;
        this.kitchen_printer = null;
        this.net_manager = null;
        this.printing_type = "PDF";
    }

    /**
     * Printer data must be imported by the window manager.
     * 
     * @param {*} printer_data 
     */
    async loadPrinters(printer_data) {
        this.available_printers = printer_data;
    }

    async setKitchenPrinter(printer) {
        this.kitchen_printer = printer;
        updateLocalStorage();
    }

    async setReceiptPrinter(printer) {
        this.receipt_printer = printer;
        updateLocalStorage();
    }

    async getPrintingType() {
        return this.printing_type;
    }

    async setPrintingType(type) {
        switch (type) {
            case "PDF":
                this.printing_type = type;
                updateLocalStorage();
                break;
            case "THERMAL":
                this.printing_type = type;
                updateLocalStorage();
                break;
            default:
                console.warn(`Cannot set printing type to '${type} - invalid type provided.'`)
                return null;
        }
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

    invokeIPCHandles(moduleManager, ipcMain) {
    
        ipcMain.handle('print:load-printers', async (event, printer_data) => {
            this.loadPrinters(printer_data);
        })

        ipcMain.handle('print:get-all', async () => {
            return this.available_printers;
        })

        ipcMain.handle('print:get-kitchen-printer', async () => {
            return this.kitchen_printer;
        })
        
        ipcMain.handle('print:get-receipt-printer', async () => {
            return this.receipt_printer;
        })

        ipcMain.handle('print:set-kitchen-printer', async (event, printer) => {
            return this.setKitchenPrinter(printer);
        })
        
        ipcMain.handle('print:set-receipt-printer', async (event, printer) => {
            return this.setReceiptPrinter(printer);
        })

    }

    updateLocalStorage() {
        // TODO
    }

}

let instance = new PrintingModule();
module.exports = {instance};