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

module.exports = router