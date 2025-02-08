if (process.env.TEST != undefined) {
  require('wdio-electron-service/preload');
}

// expose send request for getting all products
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {

  /*** Window Manager ***/

  winmngr_showPage: (page_name) => ipcRenderer.send('winmngr:show-page', page_name),

  /*** Products Module ***/

  products_getAllProducts: async () => ipcRenderer.invoke('products:get-all-products'),
  products_getProductByID: async (id) => ipcRenderer.invoke('products:get-product-by-id', id),
  products_reloadProducts: async () => ipcRenderer.invoke('products:reload-products'),
  products_changeStatus: async (id, new_status) => ipcRenderer.invoke('products:change-status', id, new_status),
  products_createProduct: async (product_data) => ipcRenderer.invoke('products:create-product', product_data),

  /*** Clerks Module ***/

  clerks_getAllClerks: async () => ipcRenderer.invoke('clerks:get-all-clerks'),
  clerks_reloadClerks: async () => ipcRenderer.invoke('clerks:reload-clerks'),
  clerks_getClerkByID: async (id) => ipcRenderer.invoke('clerks:get-clerk-by-id', id),
  clerks_getClerkByPIN: async (pin) => ipcRenderer.invoke('clerks:get-clerk-by-pin', pin),
  clerks_createClerk: async (clerk_data) => ipcRenderer.invoke('clerks:create-clerk', clerk_data),
  clerks_changeClerkStatus: async (id, new_status) => ipcRenderer.invoke('clerks:change-clerk-status', id, new_status),
  clerks_updateClerk: async (clerk_data) => ipcRenderer.invoke('clerks:update-clerk', clerk_data),
  clerks_changeRole: async (id, new_status) => ipcRenderer.invoke('clerks:change-role', id, new_status),
})