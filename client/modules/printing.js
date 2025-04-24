const escpos = require('escpos');
escpos.USB = require('escpos-usb');
let device;
try {
    device = new escpos.USB();
} catch(error) {
    console.warn("Unable to use USB Thermal Printing: ", error)
    device = null;
}


class PrintingModule {

    net_manager;
    is_printing_enabled;
    available_printers;
    receipt_printer;
    kitchen_printer;
    printing_type;
    thermal_partial_cut;

    constructor() {
        this.available_printers = [];
        this.receipt_printer = null;
        this.kitchen_printer = null;
        this.net_manager = null;
        this.printing_type = "PDF";
        this.is_printing_enabled = false;
        this.thermal_partial_cut = false;

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

    async setThermalCut(value, updateLocalStorage = true) {
        let partial_cut = Boolean(value);
        this.thermal_partial_cut = partial_cut;
        if(updateLocalStorage) this.updateLocalStorage();
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

        switch (this.printing_type) {
            case "PDF":
                // TODO - trigger generation & print of html doc receipt
                this.printReceiptPDF(data);
                break;
            case "THERMAL":
                this.printKitchenThermal(data);
                break;
            default:
                console.error("Unable to print receipt - invalid printing type set.")
                break;
        }
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

        ipcMain.handle('print:print-receipt', async (event, data) => {
            return this.printToReceipt(data);
        });

        ipcMain.handle('print:print-kitchen', async (event, data) => {
            return this.printToKitchen(data);
        });

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
        this.setThermalCut(config_data.thermal_partial_cut, false);

    }

    updateLocalStorage() {
        let config_data = this.net_manager.file_manager.config.printing;
        config_data.is_enabled = this.is_printing_enabled;
        config_data.printing_type = this.printing_type;
        config_data.kitchen_printer = this.kitchen_printer;
        config_data.receipt_printer = this.receipt_printer;
        config_data.thermal_partial_cut = this.thermal_partial_cut;

        this.net_manager.file_manager.saveCurrentConfig();
    }

    printReceiptThermal(data) {

        if(device == null) {
            console.error("Unable to print thermal receipt, error with printer.")
            return;
        }


        let venue_info = this.net_manager.module_manager.instance.getModuleByName('venue').venue_info;
        let printer = new escpos.Printer(device);
        let thermal_partial_cut = this.thermal_partial_cut;
        
        device.open(function(error) {

            /** Customer Receipt Header */
            printer.align('ct')
            printer.font("A")
            printer.size(2,2)

            // prevent overflow
            if(venue_info.venue_name.length > 15)
                printer.size(1,1);

            printer.text(venue_info.venue_name) 
            printer.size(0,0)
            // spacer between name & address
            printer.text('');

            let address_lines = venue_info.venue_address.split(',')
            address_lines.forEach(line => {
                printer.text(line);
            });

            // spacer between address & phone no
            printer.text('');
            printer.text(venue_info.venue_phone)
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

            if(data.table != null && data.table != undefined) {
                printer.text(data.table.display_name)
            } else {
                printer.text("Sale # " + data.order_id)
            }

            printer.style('NORMAL')
            printer.size(0,0)

            if(data.order_name != null && data.order_name != undefined) {
                printer.text(data.order_name)
            }

            printer.drawLine();

            // Order items header

            printer.tableCustom(
            [
                { text: "Qty", align:"LEFT", width: 0.2, style: "B"},
                { text: "Item", align:"LEFT", width: 0.65, style: "B"},
                { text: "Price", align:"RIGHT", width: 0.15, style: "B"}
            ]
            )
            printer.drawLine();

            let order_items = data.order_items

            order_items.forEach(item => {
                printer.tableCustom(
                    [
                    { text:`${item.qty} x`, align:"LEFT", width:0.2, style: 'B' },
                    { text:`${item.name}`, align:"LEFT", width:0.65},
                    { text: `${item.total}`, align:"RIGHT", width:0.15, encoding: "UK" }
                    ],
                );
            });

            printer.drawLine();

            printer.size(1,1)
            printer.style('B')

            printer.tableCustom(
            [
                { text:"", align:"LEFT", width:0.05, style: 'B' },
                { text:"TOTAL:", align:"LEFT", width:0.2},
                { text: `${data.total}`, align:"RIGHT", width:0.25, encoding: "UK" }
            ],
            );

            printer.style('NORMAL')
            printer.size(0,0)
            printer.feed(2)
            printer.text("Thank you for your custom.")
            printer.feed(2)

            printer.cut(thermal_partial_cut)
            printer.close();

        });


        

    }

    printKitchenThermal(data) {

        if(device == null) {
            console.error("Unable to print thermal receipt, error with printer.")
            return;
        }
        
        let printer = new escpos.Printer(device);
        let thermal_partial_cut = this.thermal_partial_cut;
        
        device.open(function(error) {

            // padding at top of kitchen order
            // used to have enough paper to clip into ticket rail

            printer.align("CT")
            printer.font("A")
            printer.style("B")
            printer.feed(4)
            printer.size(0,0)

            printer.tableCustom(
                [
                    { text:`${data.timestamp}`, align:"LEFT", width:0.6},
                    { text: `${data.clerk}`, align:"RIGHT", width:0.4}
                ],
                );

            // kitchen order header

            printer.drawLine();
            printer.size(2,2)
            printer.text(`Sale # ${data.order_id}`) // suborder_id
            if(data.table != null && data.table != undefined) {
                printer.text(`${data.table.display_name}`)
                printer.size(2,2)
                printer.text(`Seats ${data.table.seats}`)
            }
            printer.style("NORMAL")
            printer.size(1,1)
            if(data.order_name !== null) printer.text(`${data.order_name}`)
            printer.size(0,0)
            printer.drawLine();

            // order contents

            printer.align("LT")
            printer.size(1,1)
            
            data.order_items.forEach(line => {
                printer.text(`${line.qty}x ${line.name}`)
                if(line.comments != null && line.comments != undefined) {
                    printer.text(`- '${line.comments}'`)
                }
            });           

            // footer
            printer.size(0,0)
            printer.align("CT")
            printer.drawLine();
            printer.feed(2);
            printer.cut(thermal_partial_cut);
            printer.close();
        });
    }

}

let instance = new PrintingModule();
module.exports = {instance};