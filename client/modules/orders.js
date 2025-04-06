class OrdersModule {

    net_manager;
    module_manager;
    open_orders;
    closed_orders;
    active_order_id;

    constructor() {
        this.open_orders = {};
        this.closed_orders = {};
        this.active_order_id = null;
    }

    async init() {
        await this.cacheOpenOrders();
        await this.cacheClosedOrders();
        console.log(`Loaded orders (open: ${Object.keys(this.open_orders).length}, closed: ${Object.keys(this.closed_orders).length}).`)
    }

    async cacheOpenOrders() {
        try {
            // have to use pre-ready request as electron net not enabled until app.onReady is done
            const open_orders = await this.net_manager.pre_ready_request('/api/orders/get/is_open/true');
            
            open_orders.forEach(order => {
                // parse 0 & 1 as true & false
                order["is_open"] = Boolean(order["is_open"])
                order["is_paid"] = Boolean(order["is_paid"])
                this.addOrderToLocalStorage(order, this.open_orders)
            })
        } catch(err) {
            // TODO - retrieve open orders from cache

            // TODO - use a blank array for now, need to pull from local cache
            const open_orders = this.open_orders;
            
            open_orders.forEach(order => {
                // parse 0 & 1 as true & false
                order["is_open"] = Boolean(order["is_open"])
                order["is_paid"] = Boolean(order["is_paid"])
                this.addOrderToLocalStorage(order, this.open_orders)
            })
        }
        
    }

    async cacheClosedOrders() {
        try {
            // have to use pre-ready request as electron net not enabled until app.onReady is done
            const closed_orders = await this.net_manager.pre_ready_request('/api/orders/get/is_open/false');
            
            closed_orders.forEach(order => {
                // parse 0 & 1 as true & false
                order["is_open"] = Boolean(order["is_open"])
                order["is_paid"] = Boolean(order["is_paid"])
                this.addOrderToLocalStorage(order, this.closed_orders)
            })
        } catch(err) {
            // TODO - retrieve open orders from cache

            // TODO - use a blank array for now, need to pull from local cache
            const closed_orders = this.closed_orders;
            
            closed_orders.forEach(order => {
                // parse 0 & 1 as true & false
                order["is_open"] = Boolean(order["is_open"])
                order["is_paid"] = Boolean(order["is_paid"])
                this.addOrderToLocalStorage(order, this.closed_orders)
            })
        }
        
    }

    addOrderToLocalStorage(order, storage_dest) {
        storage_dest[order.id] = order;
    }

    async getOrderByID(id) {
        try {

            var order = this.open_orders[id];

            if(order != undefined && order != null) {
                // order is open & exists
                return order;
            }

            order = this.closed_orders[id];

            if(order != undefined && order != null) {
                // order is closed & exists
                return order;
            }

            throw new Error(`Order not found`);

        } catch(err) {
            console.warn(`Cannot retrieve order # ${id} - order not found`)
            return null;
        }
    }

    async setTable(order_id, table_id) {

        try {

            // check for only open orders, cannot assign table to order if order already closed
            var order = this.open_orders[order_id];

            // check if order exists
            if(order == null || order == undefined) {
                console.warn(`Error setting table for order - order not found.`)
                return null;
            }

            // check table exists
            var table = this.module_manager.getModuleByName('tables').getTableByID(table_id);
            if(table == null || table == undefined) {
                console.warn(`Error setting table for order ${order_id} - table not found.`)
                return {error: "Table not found"};
            }

            // input validation passed - create table
            var response = await this.net_manager.async_post('/api/orders/set_table', {table_id: table_id, order_id: order_id});
                
            if(response["message"] != undefined) {
                
                // success - update local object
                this.open_orders[order_id].table_id = table_id;

                return true;
            } else {
                return {error: "Error occurred setting table for order", details: response["error"]}
            }

        } catch(err) {
            console.error(`Error setting table for order ${order_id}: `, err);
            return {error: "An error occurred assigning table to order"};
        }

    }

    async setOrderName(order_id, name) {
        try {

            // check for only open orders, cannot assign table to order if order already closed
            var order = this.open_orders[order_id];

            // check if order exists
            if(order == null || order == undefined) {
                console.warn(`Error setting table for order - order not found.`)
                return null;
            }

            // input validation passed - create table
            var response = await this.net_manager.async_post('/api/orders/set_name', {name: name, order_id: order_id});
                
            if(response["message"] != undefined) {
                
                // success - update local object
                this.open_orders[order_id].order_name = name;

                return true;
            } else {
                return {error: "Error occurred setting name for order", details: response["error"]}
            }

        } catch(err) {
            console.error(`Error setting order name for order ${order_id}: ${err}`);
            return {error: "An error occurred setting order name"};
        }
    }

    async createNewSuborder(order_id, clerk_id) {

        // check clerk exists
        var clerk = this.module_manager.getModuleByName('clerks').clerks[clerk_id];

        if(clerk == null || clerk == undefined) {
            console.warn(`Unable to create suborder - clerk # ${clerk_id} does not exist`)
            return null;
        }

        // check order exists
        let order = this.getOrderByID(order_id);
        
        if(order == null) {
            console.warn(`Unable to create suborder - order # ${order_id} does not exist`)
            return null;
        }

        // input validation passed - create suborder
        var response = await this.net_manager.async_post('/api/suborder/create', 
            {
                order_id: order_id,
                clerk_id: clerk_id,
            }
        );
            
        if(response["message"] != undefined) {
            
            // create lines as blank as suborder has just been made, so lines cannot yet exist
            response.suborder_details.lines = [];

            // success - create local object - TODO
            this.open_orders[order_id].suborders.push(response.suborder_details);
            return response.suborder_details;
        } else {
            return {error: "Error occurred creating suborder", details: response["error"]}
        }

    }

    async createNewOrder(clerk_id, order_name, table_id) {

        // check clerk exists
        var clerk = this.module_manager.getModuleByName('clerks').clerks[clerk_id];

        if(clerk == null || clerk == undefined) {
            console.warn(`Unable to create order - clerk # ${clerk_id} does not exist`)
            return null;
        }

        // order name & table id can be null, build request body

        let data = {clerk_id: clerk_id};
        if(table_id != null) {
            data.table_id = table_id;
        }

        if(order_name != null) {
            data.order_name = order_name;
        }
    
        // input validation passed - create order
        var response = await this.net_manager.async_post('/api/orders/create', data);
            
        if(response["message"] != undefined) {
            
            // success - create local object
            var order = response.order_data;

            this.open_orders[order.id] = order;
            return order.id;
        } else {
            return {error: "Error occurred creating order", details: response["error"]}
        }

    }

    async payOrderAndClose(order_id, payment_method_id) {

        try {

            // check order exists
            var order = this.open_orders[order_id];

            if(order == null || order == undefined) {
                console.warn("Unable to pay & close order - order not found");
                return {error: "Unable to pay & close order - order not found"};
            }

            // check payment method exists
            var payment_method = this.module_manager.getModuleByName('payment_methods').methods[payment_method_id];

            if(payment_method == null || payment_method == undefined) {
                console.warn(`Failed to pay & close order # ${order_id} - payment method not found`);
                return {error: `Failed to pay & close order # ${order_id} - payment method not found`}
            }

            // input validation passed - carry out remote update then update locally

            var response = await this.net_manager.async_post(`/api/orders/pay/${order_id}`, {payment_method: payment_method_id});
            
            if(response["message"] != undefined) {

                // LOCAL UPDATE:
                delete this.open_orders[order_id];
                this.closed_orders[order_id] = order;

                return response["order_details"];

            } else {
                return {error: "An error occurred", details: response["error"]}
            }

        } catch(err) {
            return {error: "Error marking order as paid & closing order", details: err}
        }

    }

    async getActiveOrder() {
        return await this.getOrderByID(this.active_order_id);
    }

    async setActiveOrder(order_id) {
        this.active_order_id = order_id;
    }

    // TODO - be able to lock orders


    invokeIPCHandles(moduleManager, ipcMain) {

        // initalise module manager
        this.module_manager = moduleManager.instance;

        ipcMain.handle('orders:get-open', async () => {
            return this.open_orders;
        });

        ipcMain.handle('orders:get-closed', async () => {
            return this.closed_orders;
        })

        ipcMain.handle('orders:create', async (event, clerk_id, order_name, table_id) => {
            return this.createNewOrder(clerk_id, order_name, table_id);
        })

        ipcMain.handle('orders:create-suborder', async (event, order_id, clerk_id) => {
            return this.createNewSuborder(order_id, clerk_id);
        })

        ipcMain.handle('orders:reload-open', async () => { 
            this.open_orders = {}; // clear
            this.cacheOpenOrders(); // load
            return this.open_orders // output
        })

        ipcMain.handle('orders:reload-closed', async () => { 
            this.closed_orders = {}; // clear
            this.cacheClosedOrders(); // load
            return this.closed_orders; // output
        })

        ipcMain.handle('orders:get-by-id', async (event, id) => {
            return this.getOrderByID(id);
        })

        ipcMain.handle('orders:set-table', async (event, order_id, table_id) => {
            return await this.setTable(order_id, table_id);
        })

        ipcMain.handle('orders:pay-and-close', async (event, order_id, payment_method_id) => {
            return this.payOrderAndClose(order_id, payment_method_id);
        })

        ipcMain.handle('orders:get-active', async () => {
            return this.getActiveOrder();
        });

        ipcMain.handle('orders:set-active', async (event, order_id) => {
            return this.setActiveOrder(order_id);
        });

        ipcMain.handle('orders:set-name', async (event, order_id, name) => {
            return this.setOrderName(order_id, name);
        })


    }


}

const instance = new OrdersModule();
module.exports = {instance};