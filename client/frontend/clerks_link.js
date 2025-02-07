var clerks;

async function getClerkByPIN(pin) {
    return await window.electronAPI.clerks_getClerkByPIN(pin);
}