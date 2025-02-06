if (process.env.TEST != undefined) {
  require('wdio-electron-service/preload');
}

// expose send request for getting all products
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  winmngr_showPage: (page_name) => ipcRenderer.send('winmngr.show-page', page_name),
  products_getAllProducts: async () => ipcRenderer.invoke('products.get-all-products'),
  products_getProductByID: async (id) => ipcRenderer.invoke('products.get-product-by-id', id)
})