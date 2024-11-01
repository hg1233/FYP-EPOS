import { expect } from '@wdio/globals';
import { app } from 'electron';
import { browser } from 'wdio-electron-service';

// import & register products module for testing
const mm = require('../../managers/module_manager.js');
mm.instance.registerModule('products', require('../../modules/products.js').instance);
var productsModule = mm.instance.getModuleByName('products')

describe('products module tests', () => {
    it('should setup default products on init', async () => {
        var productsData = await productsModule.getAllProducts();
        expect(Object.keys(productsData).length).toBeGreaterThanOrEqual(1);
    })

    it('should create a product given valid data', async () => {
        var productsCountBefore = await Object.keys(productsModule.getAllProducts()).length;
        productsModule.addProduct({"id": 9001, "name": "Test Product", "price": 150})
        var productsCountAfter = await Object.keys(productsModule.getAllProducts()).length;
        expect(productsCountAfter-productsCountBefore).toEqual(1);
    })

    it('should error when given invalid data to create a product', async () => {
        var productsCountBefore = await Object.keys(productsModule.getAllProducts()).length;
        productsModule.addProduct({"id": 9001, "name": "Test Product", "price": -5000})
        var productsCountAfter = await Object.keys(productsModule.getAllProducts()).length;
        expect(productsCountAfter-productsCountBefore).toEqual(0);
    })

    it('should update product when given valid data', async () => {
        productsModule.updateProduct({"id": 9001, "name": "Test Product New Name", "price": 5000})
        var newProductData = productsModule.getProductByID(9001);
        expect(newProductData.name).toEqual("Test Product New Name");
        expect(newProductData.price).toEqual(5000);
    })

    it('should not update product when given invalid data', async () => {
        productsModule.updateProduct({"id": 9001, "name": "Test Product New Name 2", "price": -5000})
        var newProductData = productsModule.getProductByID(9001);
        expect(newProductData.name).toEqual("Test Product New Name");
        expect(newProductData.price).toEqual(5000);
    })
});