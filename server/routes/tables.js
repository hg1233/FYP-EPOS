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
        console.error("Error occurred retrieving all tables:", err)
        response.status(500).json({error: "Error occurred retrieving all tables"})
    }

})

router.get("/get/:id", async (request, response) => {

    try {

        var table = await Tables.getByID(request.params.id);

        // if table not found
        if(table == undefined) {
            console.log(`[Tables > Get By ID] No table matching requested ID '${request.params.id}' found`);
            response.json({error: "Table not found"});
            return;
        }

        response.status(200).json(table);

    } catch(err) {
        console.error(`Error occurred retrieving table from ID ${request.params.id}:`, err)
        response.status(500).json({error: "Error occurred retrieving table from ID"})
    }


})

router.post("/create", async (request, response) => {

    try {

        var display_name = request.body["display_name"];
        var seats = request.body["seats"];

        // input validation
        if(!isDisplayNameValid(display_name)) {
            console.log("[Tables > Create] Input validation failed for display_name - creation of table prevented");
            response.status(400).json({error: "Error creating table - display name invalid"})
            return;
        }

        // check seats input is a valid number
        if(!isSeatsValid(seats)) {
            console.log("[Tables > Create] Input validation failed for seats - creation of table prevented");
            response.status(400).json({error: "Error creating table - seats input invalid"})
            return;
        }

        var table = (await Tables.create(display_name, seats))[0]
        console.log("[Tables > Create] New table created. ID:", table.id)
        response.status(200).json({message: "Successfully created new table.", table_id: table.id})

    } catch(err) {
        console.error("Error occurred creating table:", err)
        response.status(500).json({error: "Error occurred creating table"})
    }
})

router.post("/disable", async (request, response) => {

    try {

        var table_id = request.body["id"]
        var table = await Tables.getByID(table_id)

        // check table ID valid
        if(table == undefined) {
            console.log(`[Tables > Disable] Table with ID # ${table_id} not found`)
            response.status(400).json({error: "Error disabling table - table not found"});
            return;
        }

        var result = await Tables.change_status(table_id, false);
        console.log(`[Tables > Disable] Disabled Table ID # ${table_id}`)
        response.status(200).json({message: "Successfully changed table status", new_status: Boolean(result[0].enabled)})


    } catch(err) {
        console.error(`Error disabling table with ID # ${request.body["id"]} : `, err)
        request.status(500).json({error: "Error occurred disabling table"})
    }


})

router.post("/enable", async (request, response) => {

    try {

        var table_id = request.body["id"]
        var table = await Tables.getByID(table_id)

        // check table ID valid
        if(table == undefined) {
            console.log(`[Tables > Enable] Table with ID # ${table_id} not found`)
            response.status(400).json({error: "Error enabling table - table not found"});
            return;
        }

        var result = await Tables.change_status(table_id, true);
        console.log(`[Tables > Enable] Enabled Table ID # ${table_id}`)
        response.status(200).json({message: "Successfully changed table status", new_status: Boolean(result[0].enabled)})


    } catch(err) {
        console.error(`Error enabling table with ID # ${request.body["id"]} : `, err)
        request.status(500).json({error: "Error occurred enabling table"})
    }


})

router.post("/update", async (request, response) => {

    try {

        var table_id = request.body["id"]
        var display_name = request.body["display_name"]
        var seats = request.body["seats"]

        var table = await Tables.getByID(table_id);
        
        // check table ID valid
        if(table == undefined) {
            console.log(`[Tables > Update] Table with ID # ${table_id} not found`)
            response.status(400).json({error: "Error updating table - table not found"});
            return;
        }

        // input validation
        if(!isDisplayNameValid(display_name)) {
            console.log("[Tables > Update] Input validation failed for display_name - creation of table prevented");
            response.status(400).json({error: "Error updating table - display name invalid"})
            return;
        }

        // check seats input is a valid number
        if(!isSeatsValid(seats)) {
            console.log("[Tables > Update] Input validation failed for seats - creation of table prevented");
            response.status(400).json({error: "Error updating table - seats input invalid"})
            return;
        }

        // all data valid, update record
        var new_data = (await Tables.update(table_id, display_name, seats))[0];
        console.log(`[Tables > Update] Table ${table_id} updated`);
        response.status(200).json({message: "Table updated successfully.", new_data: new_data})

    } catch(err) {
        console.error("Error updating table:", err)
        response.status(500).json({error: "Error occurred updating table"})
    }

})

// name must not be undefined, not be blank & be longer than 0 chars
function isDisplayNameValid(name) {
    return name != undefined && name.trim() != "" && name.length != 0;
}

// must be a valid number when parsed
function isSeatsValid(seats) {
    return !isNaN(Number(seats));
}

module.exports = router