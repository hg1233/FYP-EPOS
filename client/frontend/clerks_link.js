var clerks;

async function getClerkByPIN(pin) {
    return await window.electronAPI.clerks_getClerkByPIN(pin);
}

async function getAllClerks() {
    return await window.electronAPI.clerks_getAllClerks();
}

async function getClerkByID(id) {
    return await window.electronAPI.clerks_getClerkByID(id);
}

async function createClerk(name, pin) {
    return await window.electronAPI.clerks_createClerk({name: name, pin: pin});
}

async function reloadClerks() {
    clerks = await window.electronAPI.clerks_reloadClerks();
}

async function updateClerk(id, name, pin) {
    // required for input validation
    pin = pin.toString()
    let result = await window.electronAPI.clerks_updateClerk({id: id, name: name, pin: pin})
    reloadClerks();
    return result;
}

async function setClerkRole(id, is_manager) {
    let result = await window.electronAPI.clerks_changeRole(id, is_manager);
    reloadClerks();
    return result;
}

async function setClerkStatus(id, new_status) {
    let result = await window.electronAPI.clerks_changeClerkStatus(id, new_status);
    reloadClerks();
    return result;
}

reloadClerks();

setTimeout(() => {
    // update clerks in the browser's local variable every 60 seconds
    reloadClerks();
}, 60*1000);