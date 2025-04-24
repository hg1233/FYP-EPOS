let printers;

async function setupPrinters() {
    loadPrinters(await window.webContents.getPrintersAsync())
}

async function printReceipt(data) {
    return await window.electronAPI.print_printReceipt(data);
}

async function printKitchen(data) {
    return await window.electronAPI.print_printKitchen(data);
}

async function loadPrinters(print_data) {
    return await window.electronAPI.print_loadPrinters(print_data);
}

async function isPrintingEnabled() {
    return await window.electronAPI.print_getGlobalStatus();
}

async function getAllPrinters() {
    return await window.electronAPI.print_getAll();
}

async function getKitchenPrinter() {
    return await window.electronAPI.print_getKitchenPrinter();
}

async function getReceiptPrinter() {
    return await window.electronAPI.print_getReceiptPrinter();
}

async function setKitchenPrinter(printer) {
    return await window.electronAPI.print_setKitchenPrinter(printer);
}

async function setReceiptPrinter(printer) {
    return await window.electronAPI.print_setReceiptPrinter(printer);
}

async function getPrintingType() {
    return await window.electronAPI.print_getType();
}

async function setPrintingType(type) {
    switch (type) {
        case "PDF":
            return await window.electronAPI.print_setType(type);
        case "THERMAL":
            return await window.electronAPI.print_setType(type);
        default:
            return {error: "Invalid type provided"}
    }
}