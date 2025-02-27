class OrdersModule {

    net_manager;
    open_orders;
    closed_orders;

    constructor() {
        this.open_orders = {};
        this.closed_orders = {};
    }

    async init() {
        await this.cacheOpenOrders();
        await this.cacheClosedOrders();
        console.log(`Loaded orders (open: ${Object.keys(this.open_orders).length}, closed: ${Object.keys(this.closed_orders).length}).`)
    }

    async cacheOpenOrders() {
        // have to use pre-ready request as electron net not enabled until app.onReady is done
        const open_orders = await this.net_manager.pre_ready_request('/api/orders/get/is_open/true');

        open_orders.forEach(order => {
            // parse 0 & 1 as true & false
            order["is_open"] = Boolean(order["is_open"])
            order["is_paid"] = Boolean(order["is_paid"])
            this.addOrderToLocalStorage(order, this.open_orders)
        })
    }

    async cacheClosedOrders() {
        // have to use pre-ready request as electron net not enabled until app.onReady is done
        const open_orders = await this.net_manager.pre_ready_request('/api/orders/get/is_open/false');

        open_orders.forEach(order => {
            // parse 0 & 1 as true & false
            order["is_open"] = Boolean(order["is_open"])
            order["is_paid"] = Boolean(order["is_paid"])
            this.addOrderToLocalStorage(order, this.closed_orders)
        })
    }

    addOrderToLocalStorage(order, storage_dest) {
        storage_dest[order.id] = order;
    }

    getOpenOrders() {
        return this.open_orders;
    }

    invokeIPCHandles(moduleManager, ipcMain) {

        ipcMain.handle('orders:get-open', async () => {
            return this.getOpenOrders();
        });

        ipcMain.handle('orders:reload-open', async () => { 
            this.open_orders = {}; // clear
            this.cacheOpenOrders(); // load
            return this.getOpenOrders(); // output
        })



    }


}

const instance = new OrdersModule();
module.exports = {instance};