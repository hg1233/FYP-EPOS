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
  products_updateProduct: async (product_data) => ipcRenderer.invoke('products:update-product', product_data),

  /*** Clerks Module ***/

  clerks_getAllClerks: async () => ipcRenderer.invoke('clerks:get-all-clerks'),
  clerks_reloadClerks: async () => ipcRenderer.invoke('clerks:reload-clerks'),
  clerks_getClerkByID: async (id) => ipcRenderer.invoke('clerks:get-clerk-by-id', id),
  clerks_getClerkByPIN: async (pin) => ipcRenderer.invoke('clerks:get-clerk-by-pin', pin),
  clerks_createClerk: async (clerk_data) => ipcRenderer.invoke('clerks:create-clerk', clerk_data),
  clerks_changeClerkStatus: async (id, new_status) => ipcRenderer.invoke('clerks:change-clerk-status', id, new_status),
  clerks_updateClerk: async (clerk_data) => ipcRenderer.invoke('clerks:update-clerk', clerk_data),
  clerks_changeRole: async (id, new_status) => ipcRenderer.invoke('clerks:change-role', id, new_status),
  clerks_setCurrent: async (id) => ipcRenderer.invoke('clerks:login', id),
  clerks_removeCurrent: async () => ipcRenderer.invoke('clerks:logout'),
  clerks_getCurrent: async () => ipcRenderer.invoke('clerks:get-current'),

  /*** Venue Module ***/

  venue_getAllInfo: async () => ipcRenderer.invoke('venue:get-all-info'),
  venue_getInfoByAttribute: async (attribute) => ipcRenderer.invoke('venue:get-info-by-attribute', attribute),
  venue_reload: async () => ipcRenderer.invoke('venue:reload'),
  venue_addAttribute: async (attribute, value) => ipcRenderer.invoke('venue:add-attribute', attribute, value),
  venue_updateAttribute: async (attribute, new_value) => ipcRenderer.invoke('venue:update-attribute', attribute, new_value),

  /*** Categories Module ***/

  categories_getAll: async () => ipcRenderer.invoke('categories:get-all-categories'),
  categories_getByID: async (id) => ipcRenderer.invoke('categories:get-category-by-id', id),
  categories_getByName: async (name) => ipcRenderer.invoke('categories:get-category-by-name', name),
  categories_reload: async () => ipcRenderer.invoke('categories:reload'),
  categories_changeStatus: async (id, status) => ipcRenderer.invoke('categories:change-status', id, status),
  categories_changeName: async (id, name) => ipcRenderer.invoke('categories:change-name', id, name),
  categories_changePriority: async (id, priority) => ipcRenderer.invoke('categories:change-priority', id, priority),
  categories_create: async (name) => ipcRenderer.invoke('categories:create', name),

  /*** Tables Module ***/

  tables_reload: async () => ipcRenderer.invoke('tables:reload'),
  tables_getAll: async () => ipcRenderer.invoke('tables:get-all'),
  tables_getByID: async (id) => ipcRenderer.invoke('tables:get-by-id', id),
  tables_create: async (display_name, seats) => ipcRenderer.invoke('tables:create', display_name, seats),
  tables_changeStatus: async (id, new_status) => ipcRenderer.invoke('tables:change-status', id, new_status),
  tables_update: async (id, display_name, seats) => ipcRenderer.invoke('tables:update', id, display_name, seats),

  /*** Orders Module ***/

  orders_getOpen: async () => ipcRenderer.invoke('orders:get-open'),
  orders_create: async (clerk_id, order_name, table_id) => ipcRenderer.invoke('orders:create', clerk_id, order_name, table_id),
  orders_getClosed: async () => ipcRenderer.invoke('orders:get-closed'),
  orders_getByID: async (id) => ipcRenderer.invoke('orders:get-by-id', id),
  orders_reloadOpen: async () => ipcRenderer.invoke('orders:reload-open'),
  orders_reloadClosed: async () => ipcRenderer.invoke('orders:reload-closed'),
  orders_setTable: async (order_id, table_id) => ipcRenderer.invoke('orders:set-table', order_id, table_id),

})