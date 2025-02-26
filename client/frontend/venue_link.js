async function getAllAttributes() {
    return await window.electronAPI.venue_getAllInfo();
}

async function getValueByAttributeName(attribute_name) {
    return await window.electronAPI.venue_getInfoByAttribute(attribute_name);
}

async function reloadVenueData() {
    return window.electronAPI.venue_reload();
}

async function addAttribute(key, value) {
    return window.electronAPI.venue_addAttribute(key, value);
}

async function changeAttribute(key, new_value) {
    return window.electronAPI.venue_updateAttribute(key, new_value);
}