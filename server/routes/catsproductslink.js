// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import categories & products link db model
const CatsProductsLink = require('../database/models/CatsProductsLinkModel.js');

router.get("/get/:id/products", async (request, response) => {
    try {
        var cat = await CatsProductsLink.getByCatID(request.params.id);

        // if category not found
        if(cat == undefined) {
            response.json({error: "No results found"});
            return;
        }

        response.json(cat);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve category from ID provided"})
    }
})

module.exports = router;