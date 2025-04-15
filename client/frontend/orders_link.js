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
    return await window.electronAPI.orders_getByID(order_id);
}


async function createOrder(clerk_id, order_name, table_id) {
    return await window.electronAPI.orders_create(clerk_id, order_name, table_id);
}

async function createSuborder(order_id, clerk_id) {
    return await window.electronAPI.orders_createSuborder(order_id, clerk_id);
}

async function createSuborderLine(order_id, suborder_id, product_id, product_name, product_unit_price, product_qty, comments) {
    return await window.electronAPI.orders_createLine(order_id, suborder_id, product_id, product_name, product_unit_price, product_qty, comments)
}

async function reloadOrdersData() {
    getOpenOrders();
    getClosedOrders();
}

async function setTableForOrder(order_id, table_id) {
    return await window.electronAPI.orders_setTable(order_id, table_id);
}

async function setOrderName(order_id, name) {
    return await window.electronAPI.orders_setName(order_id, name);
}

async function payOrderAndClose(order_id, payment_method_id) {
    return await window.electronAPI.orders_payAndClose(order_id, payment_method_id);
}

async function getActiveOrder() {
    return await window.electronAPI.orders_getActive();
}

async function setActiveOrder(order_id) {
    return await window.electronAPI.orders_setActive(order_id);
}

async function setLineComments(order_id, suborder_id, line_id, comments) {
    return await window.electronAPI.orders_setComments(order_id, suborder_id, line_id, comments);
}

async function voidSuborderLine(order_id, line_id) {
    return await window.electronAPI.orders_voidLine(order_id, line_id);
}

async function cancelOrder(order_id) {
    return await window.electronAPI.orders_cancel(order_id);
}