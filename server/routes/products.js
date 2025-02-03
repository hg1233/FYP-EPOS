// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Products db model
const Products = require('../database/models/ProductsModel.js');

// endpoint to retrieve all products
router.get("/get/all", async (request, response) => {
    try {
        var products = await Products.getAll();
        response.json(products);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve products"})
    }
})

router.get("/get/:id", async (request, response) => {
    try {
        var product = await Products.getByID(request.params.id);

        // if product not found
        if(product == undefined) {
            response.json({error: "Product not found"});
            return;
        }

        response.json(product);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve product from ID provided"})
    }
})

router.post("/create", async (request, response) => {
    try {
        var desired_name = request.body["name"];
        
        // check name is defined & not blank
        if(!isProductNameValid(desired_name)) {
            response.status(400).json({error: "Failed to create product - invalid name"})
            return;
        }

        var desired_price = request.body["price"];

        // check price is defined, a finite number and not blank
        if(!isProductPriceValid(desired_price)) {
            response.status(400).json({error: "Failed to create product - invalid price"})
            return;
        }

        // have to use brackets & index 0 as returns array of results, only want 1st entry as is an insert sql cmd
        var product = (await Products.create(desired_name, desired_price))[0]
        response.status(200).json({message: "Successfully created product.", product_id: product.id, "test": "test"});

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to create product"})
    }
})

function isProductNameValid(name) {
   return name != undefined || name.trim() != ""
}

function isProductPriceValid(price) {
    return price != undefined || !isNaN(price) || isFinite(price) || price.trim() != "";
}

module.exports = router