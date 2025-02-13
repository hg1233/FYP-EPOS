// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import categories & products link db model
const CatsProductsLink = require('../database/models/CatsProductsLinkModel.js');

/**
 * Endpoint for retrieving a list of products which are linked to a specified category ID.
 * (e.g. Category X has Products X, Y and Z as members)
 * @param {number} id - ID number of category to look up
 */
router.get("/get/:id/products", async (request, response) => {
    try {
        var linked_products = await CatsProductsLink.getByCatID(request.params.id);

        // if category not found
        if(linked_products == undefined || linked_products.length == 0) {
            response.json({error: "No results found"});
            return;
        }

        response.json(generateLinksResponse(linked_products, "product_id"))
        
        
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve products from category ID provided"})
    }
})

/**
 * Endpoint for retrieving a list of categories which a product is linked to.
 * (e.g. Product X is linked to Categories X, Y and Z)
 * @param {number} id - ID number of product to look up
 */
router.get("/get/:id/categories", async (request, response) => {
    try {
        var linked_cats = await CatsProductsLink.getByProductID(request.params.id);

        // if category not found
        if(linked_cats == undefined || linked_cats.length == 0) {
            response.json({error: "No results found"});
            return;
        }

        response.json(generateLinksResponse(linked_cats, "category_id"))
    
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve categories from ID provided"})
    }
})

/**
 * Generates a response for retrieving linked categories & products depending on 
 * endpoint queried. See `/get/:id/categories` & `/get/:id/products` endpoints.
 * @param {dictionary} linked_data 
 * @param {string} key - Key to use for processing data from database
 * @returns {json} 
 */
function generateLinksResponse(linked_data, key) {
    if(linked_data.length > 1) {
        var output = [];
        linked_data.forEach(element => {
            output.push(element[key])
        });

        return output;
    } 

    // return just 1st element
    return linked_data[0][key]
}

module.exports = router;