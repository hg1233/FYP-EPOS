// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Clerks db model
const Clerks = require('../database/models/ClerksModel.js');

// endpoint to retrieve all clerks
router.get("/get/all", async (request, response) => {
    try {
        var clerks = await Clerks.getAll();
        response.json(clerks);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve clerks"})
    }
})

router.get("/get/:id", async (request, response) => {
    try {
        var clerk = await Clerks.getByID(request.params.id);

        // if product not found
        if(clerk == undefined) {
            response.json({error: "Clerk not found"});
            return;
        }

        response.json(clerk);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve clerk from ID provided"})
    }
})

router.post("/create", async (request, response) => {
    try {
        var desired_name = request.body["name"];
        var desired_pin = request.body["pin"];
        
        // check name is defined & not blank
        if(!isClerkNameValid(desired_name)) {
            response.status(400).json({error: "Failed to create clerk - invalid name"})
            return;
        }

        // check pin passes input validation
        if(!isPinValid(desired_pin)) {
            response.status(400).json({error: "Failed to create clerk - invalid pin"})
            return;
        }

        // check pin not already in use
        if(Clerks.getByPIN(desired_pin) != undefined) {
            response.status(400).json({error: "Failed to create clerk - pin already in use"})
            return;
        }


        // have to use brackets & index 0 as returns array of results, only want 1st entry as is an insert sql cmd
        var clerk = (await Clerks.create(desired_name, desired_pin))[0]
        response.status(200).json({message: "Successfully created new clerk.", clerk_id: clerk.id});

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to create clerk"})
    }
})


// pin must be at least 1 char, an integer & not be undefined
function isPinValid(pin) {
    return pin.length != 0 && Number.isInteger(pin) && pin != undefined;
}

// name must not be undefined, not be blank & be longer than 0 chars
function isClerkNameValid(name) {
    return name != undefined && name.trim() != "" && name.length != 0;
}


module.exports = router