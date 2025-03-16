let open_orders;
let closed_orders;

async function getOpenOrders() {
    let orders = await window.electronAPI.orders_getOpen();
    open_orders = orders;
    return orders;
}

async function getClosedOrders() {
    let orders = await window.electronAPI.orders_getClosed();
    closed_orders = orders;
    return orders;
}

async function getOrderByID(order_id) {
    return await window.electronAPI.orders_getByID();
}


async function createOrder(clerk_id, order_name, table_id) {
    return await window.electronAPI.orders_create(clerk_id, order_name, table_id);
}

async function reloadOrdersData() {
    getOpenOrders();
    getClosedOrders();
}

async function setTableForOrder(order_id, table_id) {
    return await window.electronAPI.orders_setTable(order_id, table_id);
}

async function payOrderAndClose(order_id, payment_method_id) {
    return await window.electronAPI.orders_payAndClose(order_id, payment_method_id);
}