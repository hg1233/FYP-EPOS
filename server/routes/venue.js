// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Products db model
const Venue = require('../database/models/VenueModel.js');

// endpoint to retrieve all products
router.get("/get/all", async (request, response) => {
    try {
        var venue_data = await Venue.getAll();
        response.json(venue_data);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve venue data"})
    }
})

// get by attribute
router.get("/get/:attribute", async (request, response) => {
    try {
        var venue_data = await Venue.getByAttribute(request.params.attribute);

        // if product not found
        if(venue_data == undefined) {
            response.json({error: "Venue data not found"});
            return;
        }

        response.json(venue_data);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve venue data from attribute provided"})
    }
})

router.post("/add", async (request, response) => {
    try {
        var desired_attribute = request.body["attribute"];
        var desired_value = request.body["value"];
        
        // check attribute name is defined & not blank
        if(!isEntryValid(desired_attribute)) {
            response.status(400).json({error: "Failed to add venue data - invalid attribute name"})
            return;
        }

        var attribute_exists = await Venue.getByAttribute(request.params.attribute) != undefined ? true : false;

        if(attribute_exists) {
            response.status(400).json({error: "Attribute already exists"});
            return;
        }

        // have to use brackets & index 0 as returns array of results, only want 1st entry as is an insert sql cmd
        var venue_data = (await Products.create(desired_attribute, desired_value))[0]
        response.status(200).json({message: "Successfully added venue data.", venue_data: venue_data});

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to add venue data"})
    }
})

router.post("/update", async (request, response) => {
    try{

        var attribute_name = request.body["attribute"];
        var desired_value = request.body["value"];

        var attribute = await Venue.getByAttribute(attribute_name);

        if(attribute == undefined) {
            response.status(400).json({error: "Venue attribute not found"});
            return;
        }
        

        var status = await Venue.update(attribute, desired_value);
        var new_attribute_value = status[0]["value"];
        response.status(200).json({message: "Venue attribute updated successfully.", new_value: new_attribute_value})

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error occurred updating venue attribute"})
    }
})




function isEntryValid(input) {
    return input != undefined && input.trim() != ""
}