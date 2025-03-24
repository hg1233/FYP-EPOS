let tables;

async function getAllTables() {
    return await window.electronAPI.tables_getAll();
}

async function getAllTablesWithOrderData(is_order_open) {
    return await window.electronAPI.tables_getAllWithOrderData(is_order_open);
}

async function getTableByID(id) {
    return await window.electronAPI.tables_getByID(id)
}

async function createTable(name, seats) {
  return await window.electronAPI.tables_create(name, seats)
}

async function setTableStatus(id, new_status) {
    return await window.electronAPI.tables_changeStatus(id, new_status)
}

async function updateTable(id, name, seats) {
    return await window.electronAPI.tables_update(id, name, seats);
}