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
    it('should run init function on registration of module', async () => {
        let testModule = new TestModule();
        const moduleManager = require('../managers/module_manager.js');
        moduleManager.instance.registerModule("Test Module", testModule);
        expect(testModule.isModuleInitalised).toEqual(true);
    })


});