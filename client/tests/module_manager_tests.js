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

class TestModule2 {
    handleEvent(event, data) {
        switch(event) {
            case 'TEST_EVENT_WITH_NO_DATA':
                return true;
            case 'TEST_EVENT_WITH_DATA':
                return data;
            default:
                throw new Error("Event not found.");
        }
    }
}

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

    it('should handle an event when properly configured', () => {
        moduleManager.instance.registerModule("Test Module 2", new TestModule2());
        expect(moduleManager.instance.sendEventPrivately("Test Module 2", "TEST_EVENT_WITH_NO_DATA")).toEqual(true);
        expect(moduleManager.instance.sendEventPrivately("Test Module 2", "TEST_EVENT_WITH_DATA", 12345)).toEqual(12345);
    })

    it('should error when sending an event that is not configured to be handled', () => {
        try {
            moduleManager.instance.sendEventPrivately("Test Module 2", "SOME_RANDOM_EVENT", "SOME_RANDOM_DATA")
        } catch(error) {
            expect(error.message).toEqual("Event not found.");
        }
        return false;
    })


});