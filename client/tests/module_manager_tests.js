import { expect } from '@wdio/globals';
import { app } from 'electron';
import { browser } from 'wdio-electron-service';

class TestModule {
    constructor() {
        this.isModuleInitalised = false;
    }
    init() {
        this.isModuleInitalised = true;
    }
}

// TODO - write tests to confirm that module manager setup works as expected

describe('module manager setup tests', () => {
    let testModule = new TestModule();
    const moduleManager = require('../managers/module_manager.js');
    it('should run init function on registration of module', async () => {
        moduleManager.instance.registerModule("Test Module", testModule);
        expect(testModule.isModuleInitalised).toEqual(true);
    })

    it('should list all modules registered', () => {
        expect(moduleManager.instance.getAllModuleNames().includes("Test Module")).toEqual(true);
    })

    it('should retrieve module objects by name when queried', () => {
        expect(moduleManager.instance.getModuleByName("Test Module")).toEqual(testModule);
    })

    it('should error when sending an event privately to a module with no defined code to handle events', () => {
        try {
            moduleManager.instance.sendEventPrivately("Test Module", "TEST_EVENT", "TEST_DATA")
        } catch(error) {
            return true;
        }
        return false;
    })


});