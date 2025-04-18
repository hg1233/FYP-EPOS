class PaymentMethodsModule {

    methods;

    constructor() {
        this.methods = {};
    }

    init() {
        this.cachePaymentMethods();
    }

    async cachePaymentMethods() {

        // have to use pre-ready request as electron net not enabled until app.onReady is done
        const methods = await this.net_manager.pre_ready_request('/api/payment_methods/get/all');

        // no pre-processing required, basic db structure
        this.methods = methods;

        console.log(`Loaded payment methods (total: ${Object.keys(this.methods).length}).`)

    }

    invokeIPCHandles(moduleManager, ipcMain) {

        ipcMain.handle('payment:get-all-methods', async (event, order_id, name) => {
            return this.methods.methods;
        })

    }

}

const instance = new PaymentMethodsModule();
module.exports = {instance};