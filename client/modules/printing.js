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
        this.is_printing_enabled = false;

        // to allow time for net_manager to be initialised
        setTimeout(() => {
            this.getDataFromConfig();
        }, 1000);

        
    }

    /**
     * Printer data must be imported by the main app file.
     * 
     * @param {list} printer_data 
     */
    async loadPrinters(printer_data) {
        this.available_printers = printer_data;
    }

    async setKitchenPrinter(printer, updateLocalStorage = true) {
        this.kitchen_printer = printer;
        if(updateLocalStorage) this.updateLocalStorage();
    }

    async setReceiptPrinter(printer, updateLocalStorage = true) {
        this.receipt_printer = printer;
        if(updateLocalStorage) this.updateLocalStorage();
    }

    async getPrintingType() {
        return this.printing_type;
    }

    async setPrintingType(type, updateLocalStorage = true) {
        switch (type) {
            case "PDF":
                this.printing_type = type;
                if(updateLocalStorage) this.updateLocalStorage();
                break;
            case "THERMAL":
                this.printing_type = type;
                if(updateLocalStorage) this.updateLocalStorage();
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

        switch (this.printing_type) {
            case "PDF":
                // TODO - trigger generation & print of html doc receipt
                this.printReceiptPDF(data);
                break;
            case "THERMAL":
                this.printReceiptThermal(data);
                break;
            default:
                console.error("Unable to print receipt - invalid printing type set.")
                break;
        }
       
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

        ipcMain.handle('print:get-global-status', async () => {
            return this.is_printing_enabled;
        })

        ipcMain.handle('print:set-global-status', async (event, status) => {
            this.is_printing_enabled = status;
        })

        ipcMain.handle('print:get-type', async () => {
            return this.printing_type;
        })

        ipcMain.handle('print:set-type', async (event, type) => {
            return this.setPrintingType(type);
        })

    }

    async getDataFromConfig() {
        let config_data = this.net_manager.file_manager.config.printing;

        this.is_printing_enabled = config_data.is_enabled;
        this.setPrintingType(config_data.printing_type, false);
        this.setKitchenPrinter(config_data.kitchen_printer, false)
        this.setReceiptPrinter(config_data.receipt_printer, false)

    }

    updateLocalStorage() {
        let config_data = this.net_manager.file_manager.config.printing;
        config_data.is_enabled = this.is_printing_enabled;
        config_data.printing_type = this.printing_type;
        config_data.kitchen_printer = this.kitchen_printer;
        config_data.receipt_printer = this.receipt_printer;

        this.net_manager.file_manager.saveCurrentConfig();
    }

    printReceiptThermal(data) {

        let printer; // TODO - setup correct ESCPOS integration
        
        /** Customer Receipt Header */
        printer.align('ct')
        printer.font("A")
        printer.size(2,2)
        printer.text("The Pub") // TODO - pull from venue attributes 
        printer.size(0,0)
        printer.text("141 Broad Lane, Essington") // TODO - pull from venue attributes
        printer.text("Wolverhampton") // TODO - pull from venue attributes
        printer.text("WV11 2RH") // TODO - pull from venue attributes
        printer.text("01902 000000 | www.thepub.co.uk") // TODO - pull from venue attributes
        printer.feed(1)

        printer.tableCustom(
            [
              { text: `Clerk: ${data.clerk}`, align:"LEFT", width: 0.4},
              { text: `${data.timestamp}`, align:"RIGHT", width: 0.6}
            ]
        )

        // styling for order info
        printer.drawLine();
        printer.size(1,1)
        printer.style('B')

        if(data.table !== null) {
            printer.text(data.table.display_name)
        } else {
            printer.text(data.order_id)
        }

        printer.style('NORMAL')
        printer.size(0,0)

        if(data.order_name !== null) {
            printer.text(data.order_name)
        }

        printer.drawLine();

        // Order items header

        printer.tableCustom(
        [
            { text: "Qty", align:"LEFT", width: 0.2, style: "B"},
            { text: "Item", align:"LEFT", width: 0.45, style: "B"},
            { text: "Price", align:"RIGHT", width: 0.35, style: "B"}
        ]
        )
        printer.drawLine();

        let order_items; // TODO - define this

        order_items.forEach(item => {
            printer.tableCustom(
                [
                  { text:`${item.qty} x`, align:"LEFT", width:0.2, style: 'B' },
                  { text:`${item.name}`, align:"LEFT", width:0.45},
                  { text: `${item.subtotal}`, align:"RIGHT", width:0.35, encoding: "UK" }
                ],
              );
        });

        printer.drawLine();

        printer.size(1,1)
        printer.style('B')

        printer.tableCustom(
        [
            { text:"", align:"LEFT", width:0.1, style: 'B' },
            { text:"TOTAL:", align:"LEFT", width:0.2},
            { text: `${data.total}`, align:"RIGHT", width:0.2, encoding: "UK" }
        ],
        );

        printer.style('NORMAL')
        printer.size(0,0)
        printer.feed(2)
        printer.text("Thank you for your custom.")
        printer.feed(2)

        printer.cut(true) // TODO - flag to set true/false for partial cut (true) or full cut (false)
        printer.close();

    }

}

let instance = new PrintingModule();
module.exports = {instance};