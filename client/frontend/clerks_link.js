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

