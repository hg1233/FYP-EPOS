// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import categories, products & link db model
const CatsProductsLink = require('../database/models/CatsProductsLinkModel.js');
const Products = require('../database/models/ProductsModel.js');
const Categories = require('../database/models/CategoriesModel.js');

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

router.post("/create", async (request, response) => {

    try {

        var cat_id = request.body["category_id"];
        var prod_id = request.body["product_id"];

        // check both supplied IDs exist in DB and are defined
        if(Categories.getByID(cat_id) == undefined || Products.getByID(prod_id) == undefined
            || cat_id == undefined || prod_id == undefined) {
            response.status(400).json({error: "Invalid data - Category ID or Product ID not found"})
            return;
        }

        // check link does not already exist
        let check_exists = generateLinksResponse(await CatsProductsLink.getByProductID(prod_id), "category_id");

        // if only 1 category linked to product ID currently
        if(typeof check_exists == "number" && cat_id == check_exists) {
            response.status(400).json({error: "Link between category & product already exists"})
            return;
        }

        // if more than 2 categories linked to product ID currently
        if(typeof check_exists != "number") {
            // check for duplicates
            if(check_exists.includes(Number(cat_id))) {
                response.status(400).json({error: "Link between category & product already exists"})
                return;
            }
            // else, continue with below logic
        }

        // link does not already exist - create it
        await CatsProductsLink.createLink(cat_id, prod_id);
        return response.status(200).json({message: "Successfully created link"});

    } catch(err) {
        console.error(err)
        response.status(500).json({error: "Error occurred creating product & category link"})
    }

})

router.post("/remove", async (request, response) => {
    try {

        var cat_id = request.body["category_id"];
        var prod_id = request.body["product_id"];

        // check both supplied IDs exist in DB and are defined
        if(Categories.getByID(cat_id) == undefined || Products.getByID(prod_id) == undefined
            || cat_id == undefined || prod_id == undefined) {
            response.status(400).json({error: "Invalid data - Category ID or Product ID not found"})
            return;
        }

        // check link does not already exist
        let check_exists = generateLinksResponse(await CatsProductsLink.getByProductID(prod_id), "category_id");

        // if only 1 category linked to product ID currently
        if(typeof check_exists == "number" && cat_id != check_exists) {
            response.status(400).json({error: "Link between category & product does not exist"})
            return;
        }

        // if more than 2 categories linked to product ID currently
        if(typeof check_exists != "number") {
            // check if link exists
            if(!check_exists.includes(Number(cat_id))) {
                response.status(400).json({error: "Link between category & product does not exist"})
                return;
            }
            // else, continue with below logic
        }

        // link exists - remove it
        await CatsProductsLink.removeLink(cat_id, prod_id);
        return response.status(200).json({message: "Successfully removed link"});

    } catch(err) {
        response.status(500).json({error: "Error occurred removing category & product link"})
    }


})

module.exports = router;