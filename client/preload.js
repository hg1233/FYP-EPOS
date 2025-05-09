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
  products_createCategoryLink: async (product_id, category_id) => ipcRenderer.invoke('products:create-cat-link', product_id, category_id),
  products_removeCategoryLink: async (product_id, category_id) => ipcRenderer.invoke('products:remove-cat-link', product_id, category_id),

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
  tables_getAllWithOrderData: async (order_status) => ipcRenderer.invoke('tables:get-with-order-data', order_status),
  tables_getByID: async (id) => ipcRenderer.invoke('tables:get-by-id', id),
  tables_getByIDWithOrderData: async (id, is_order_open) => ipcRenderer.invoke('tables:get-by-id-with-order-data', id, is_order_open),
  tables_create: async (display_name, seats) => ipcRenderer.invoke('tables:create', display_name, seats),
  tables_changeStatus: async (id, new_status) => ipcRenderer.invoke('tables:change-status', id, new_status),
  tables_update: async (id, display_name, seats) => ipcRenderer.invoke('tables:update', id, display_name, seats),

  /*** Orders Module ***/

  orders_getOpen: async () => ipcRenderer.invoke('orders:get-open'),
  orders_create: async (clerk_id, order_name, table_id) => ipcRenderer.invoke('orders:create', clerk_id, order_name, table_id),
  orders_createSuborder: async (order_id, clerk_id) => ipcRenderer.invoke('orders:create-suborder', order_id, clerk_id),
  orders_createLine: async (order_id, suborder_id, product_id, product_name, product_unit_price, product_qty, line_comments) => ipcRenderer.invoke('orders:add-line', order_id, suborder_id, product_id, product_name, product_unit_price, product_qty, line_comments),
  orders_getClosed: async () => ipcRenderer.invoke('orders:get-closed'),
  orders_getByID: async (id) => ipcRenderer.invoke('orders:get-by-id', id),
  orders_reloadOpen: async () => ipcRenderer.invoke('orders:reload-open'),
  orders_reloadClosed: async () => ipcRenderer.invoke('orders:reload-closed'),
  orders_setTable: async (order_id, table_id) => ipcRenderer.invoke('orders:set-table', order_id, table_id),
  orders_payAndClose: async (order_id, payment_method_id) => ipcRenderer.invoke('orders:pay-and-close', order_id, payment_method_id),
  orders_getActive: async () => ipcRenderer.invoke('orders:get-active'),
  orders_setActive: async (order_id) => ipcRenderer.invoke('orders:set-active', order_id),
  orders_setName: async (order_id, name) => ipcRenderer.invoke('orders:set-name', order_id, name),
  orders_setComments: async (order_id, suborder_id, line_id, comments) => ipcRenderer.invoke('orders:set-line-comments', order_id, suborder_id, line_id, comments),
  orders_voidLine: async (order_id, line_id) => ipcRenderer.invoke('orders:void-line', order_id, line_id),
  orders_cancel: async (order_id) => ipcRenderer.invoke('orders:cancel', order_id),
  orders_confirmSuborder: async (order_id, suborder_id) => ipcRenderer.invoke('orders:confirm-suborder', order_id, suborder_id),

  /*** Printing Module ***/
  
  print_loadPrinters: async (printer_data) => ipcRenderer.invoke('print:load-printers', printer_data),
  print_getKitchenPrinter: async () => ipcRenderer.invoke('print:get-kitchen-printer'),
  print_getReceiptPrinter: async () => ipcRenderer.invoke('print:get-receipt-printer'),
  print_setKitchenPrinter: async (printer) => ipcRenderer.invoke('print:set-kitchen-printer', printer),
  print_setReceiptPrinter: async (printer) => ipcRenderer.invoke('print:set-receipt-printer', printer),
  print_getAll: async () => ipcRenderer.invoke('print:get-all'),
  print_getType: async () => ipcRenderer.invoke('print:get-type'),
  print_setType: async (type) => ipcRenderer.invoke('print:set-type', type),
  print_getGlobalStatus: async () => ipcRenderer.invoke('print:get-global-status'),
  print_setGlobalStatus: async (status) => ipcRenderer.invoke('print:set-global-status', status),
  print_printReceipt: async (data) => ipcRenderer.invoke('print:print-receipt', data),
  print_printKitchen: async (data) => ipcRenderer.invoke('print:print-kitchen', data),
  print_getPartCut: async () => ipcRenderer.invoke('print:get-thermal-part-cut'),
  print_setPartCut: async (value) => ipcRenderer.invoke('print:set-thermal-part-cut', value),

  /*** Payment Methods Module ***/
  payment_getAllMethods: async () => ipcRenderer.invoke('payment:get-all-methods'),
})