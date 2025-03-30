let printers;

async function setupPrinters() {
    loadPrinters(await window.webContents.getPrintersAsync())
}

async function loadPrinters(print_data) {
    return await window.electronAPI.print_loadPrinters(print_data);
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