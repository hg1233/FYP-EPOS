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

reloadClerks();

setTimeout(() => {
    // update clerks in the browser's local variable every 60 seconds
    reloadClerks();
}, 60*1000);