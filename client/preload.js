if (process.env.TEST != undefined) {
  require('wdio-electron-service/preload');
}

// expose send request for getting all products
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  products_getAllProducts: async () => ipcRenderer.invoke('products.get-all-products'),
})