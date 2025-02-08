var clerks;

async function getClerkByPIN(pin) {
    return await window.electronAPI.clerks_getClerkByPIN(pin);
}

async function updateClerks() {
    clerks = await window.electronAPI.clerks_getAllClerks();
}

async function getClerkByID(id) {
    return await window.electronAPI.clerks_getClerkByID(id);
}

updateClerks();
async function createClerk(name, pin) {
    return await window.electronAPI.clerks_createClerk({name: name, pin: pin});
}

setTimeout(() => {
    // update clerks in the browser's local variable every 60 seconds
    updateClerks();
}, 60*1000);