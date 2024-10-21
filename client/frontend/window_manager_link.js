async function showPage(page_name) {
    return await window.electronAPI.winmngr_showPage(page_name);
}