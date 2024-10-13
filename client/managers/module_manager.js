class ModuleManager {
    constructor() {
        this.modules = {};
    }

    registerModule(module_name, module_object) {
        // check if module already registered
        if(this.modules[module_name]) {
            throw new Error(`A module with the name '${module_name}' is already registered.`);
        }

        // initialise module if init method defined
        if(typeof module_object.init === 'function') {
            module_object.init();
        }

        this.modules[module_name] = module_object;
        console.log(`Module '${module_name}' registered successfully.`);
    }

    unregisterModule(module_name) {
        // check module with that name exists
        if(!this.modules[module_name]) {
            throw new Error(`Unable to register module - no module found with name '${module_name}'.`)
        }

        // execute deactivate method for if defined
        if(typeof module_object.deactivate === 'function') {
            module_object.deactivate();
        }

        delete this.modules[module_name];
        console.log(`Module '${module_name}' un-registered successfully.`);
    }

    getModuleByName(module_name) {
        return this.modules[module_name];
    }

    getAllModuleNames() {
        return Object.keys(this.modules);
    }

    broadcastEvent(event, event_data) {
        // iterate over all modules
        for(var [module_name, module_object] of Object.entries(this.modules)) {
            // check module is setup to handle events
            if(typeof module_object.handleEvent === 'function') {
                module_object.handleEvent(event, event_data);
            }
        }
    }

    sendEventPrivately(module_name, event, event_data) {
        // send event directly to one module
        let module = this.getModuleByName(module_name);
        if(typeof module == 'undefined' || typeof module == 'null') {
            throw new Error('Unable to send event privately - module not found.');
        }

        // check module is setup to handle events
        if(typeof module.handleEvent === 'function') {
            module.handleEvent(event, event_data);
        } else {
            throw new Error(`Module ${module.module_name} is not setup to handle events.`);
        }
    }

}

const instance = new ModuleManager();

module.exports = {instance}