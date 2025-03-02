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
        var products = await Products.getAllWithCategoryData();
        response.json(products);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve products"})
    }
})

router.get("/get/:id", async (request, response) => {
    try {
        var product = await Products.getByIDWithCategoryData(request.params.id);

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
        response.status(200).json({message: "Successfully created product.", product_id: product.id});

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to create product"})
    }
})

router.post("/disable", async (request, response) => {

    try {
        toggleProductVisibility(request, response, false)
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error changing product status"})
    }

})

router.post("/enable", async (request, response) => {

    try {
        toggleProductVisibility(request, response, true)
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error changing product status"})
    }

})

router.post("/update", async (request, response) => {
    try{

        var product_id = request.body["id"];

        if(!isProductIDValid(product_id)) {
            response.status(400).json({error: "Product not found"});
            return;
        }
        
        var desired_name = request.body["name"];
        var desired_price = request.body["price"];

        // check name is defined & not blank
        if(!isProductNameValid(desired_name)) {
            response.status(400).json({error: "Failed to update product - invalid name"})
            return;
        }

        // check price is defined, a finite number and not blank
        if(!isProductPriceValid(desired_price)) {
            response.status(400).json({error: "Failed to update product - invalid price"})
            return;
        }

        var status = await Products.update(product_id, desired_name, desired_price);
        var new_product_details = status[0];
        response.status(200).json({message: "Product updated successfully.", product_id: new_product_details.id, new_name: new_product_details.name, new_price: new_product_details.price})

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error occurred updating product details"})
    }
})

async function toggleProductVisibility(request, response, status) { 

    var product_id = request.body["id"];

    // check if product exists
    if(!isProductIDValid(product_id)) {
        response.json({error: "Product not found"});
        return;
    }

    var status = await Products.toggle_status(product_id, status);
    response.status(200).json({message: "Successfully changed product visiblilty", enabled: status[0].enabled})


}

async function isProductIDValid(id) {
    return await Products.getByID(id) != undefined
}

function isProductNameValid(name) {
   return name != undefined && name.trim() != ""
}

function isProductPriceValid(price) {
    return price != undefined && !isNaN(price) && isFinite(price) && price !== 0;
}

module.exports = router