let categories;

async function getAllCategories() {
    categories = await window.electronAPI.categories_getAll();
    sortCategories();
    return categories;
}

async function reloadCategories() {
    await window.electronAPI.categories_reload();
    getAllCategories();
}

async function getCategoryByID(id) {
    return await window.electronAPI.categories_getByID(id);
}

async function getCategoryByName(name) {
    return await window.electronAPI.categories_getByName(name);
}

async function changeCatStatus(id, new_status) {
    return await window.electronAPI.categories_changeStatus(id, new_status);
}

async function changeCatName(id, new_name) {
    return await window.electronAPI.categories_changeName(id, new_name);
}

async function changeCatPriority(id, new_priority) {
    return await window.electronAPI.categories_changePriority(id, new_priority);
}

async function createCategory(name) {
    return await window.electronAPI.categories_create(name);
}


async function sortCategories() {
    categories = Object.values(categories).sort((a, b) => {

        // check if priority is not null/undefined
        // if priority is undefined, use ID as priority
        // else, use priority setting

        var pA = a.priority !== null && a.priority !== undefined ? a.priority : a.id
        var pB = b.priority !== null && b.priority !== undefined ? b.priority : b.id

        // auto-sort if calculated priorities are different
        if(pA !== pB) {
            return pA - pB;
        }

        // if calculated priorities are the same, check if the value came from priority or id attribute
        var eA = a.priority !== null && a.priority !== undefined;
        var eB = b.priority !== null && b.priority !== undefined;

        if(eA && !eB) {
            // a has priority defined, b is using id
            // prioritise a
            return -1;
        } else if(!eA && eB) {
            // b has priority defined, a is using id
            // prioritise b
            return 1;
        }

        // if both have default priority (null), and are both using ID, sort by ID
        return a.id - b.id;

    })
}

reloadCategories();