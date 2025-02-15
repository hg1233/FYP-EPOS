// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Tables db model
const Tables = require('../database/models/TablesModel.js');

router.get("/get/all", async (request, response) => {

    try { 

        var tables = await Tables.getAll();
        response.status(200).json(tables);

    } catch(err) {
        console.error("Error occurred retrieving all tables:", error)
        response.status(500).json({error: "Error occurred retrieving all tables"})
    }

})

router.get("/get/:id", async (request, response) => {

    try {

        var table = await Tables.getByID(request.params.id);

        // if table not found
        if(table == undefined) {
            response.json({error: "Table not found"});
            return;
        }

        response.status(200).json(table);

    } catch(err) {
        console.error(`Error occurred retrieving table from ID ${request.params.id}:`, error)
        response.status(500).json({error: "Error occurred retrieving table from ID"})
    }


})

module.exports = router