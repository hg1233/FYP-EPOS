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