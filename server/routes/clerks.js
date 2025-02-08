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

        // if clerk not found
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
        if(await Clerks.getByPIN(desired_pin) != undefined) {
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

router.post("/disable", async (request, response) => {

    try {
        changeClerkStatus(request, response, false)
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error changing clerk status"})
    }

})

router.post("/enable", async (request, response) => {

    try {
        changeClerkStatus(request, response, true)
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error changing clerk status"})
    }

})

router.post("/update", async (request, response) => {
    try{

        var clerk_id = request.body["id"];
        var clerk = await Clerks.getByID(clerk_id);

        // check if clerk exists
        if(clerk == undefined) {
            response.json({error: "Clerk not found"});
            return;
        }
        
        var desired_name = request.body["name"];
        var desired_pin = request.body["pin"];

        // check name is defined & not blank
        if(!isClerkNameValid(desired_name)) {
            response.status(400).json({error: "Failed to update clerk - invalid name"})
            return;
        }

        // check price is defined, a finite number and not blank
        if(!isPinValid(desired_pin)) {
            response.status(400).json({error: "Failed to update clerk - invalid price"})
            return;
        }

        var status = await Clerks.update(clerk_id, desired_name, desired_pin);
        var new_clerk_details = status[0];
        response.status(200).json({message: "Clerk updated successfully.", new_data: new_clerk_details})

    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Error occurred updating clerk details"})
    }
})

router.post("/manager", async (request, response) => {
    var clerk_id = request.body["id"];
    var is_manager = Boolean(request.body["is_manager"]);

    var clerk = await Clerks.getByID(clerk_id);

    // check if clerk exists
    if(clerk == undefined) {
        response.json({error: "Clerk not found"});
        return;
    }

    // check status change is defined correctly
    if(typeof is_manager != "boolean") {
        response.json({error: "Invalid role setting defined"})
        return;
    }

    var status = await Clerks.change_role(clerk_id, is_manager);
    response.status(200).json({message: "Successfully changed clerk role", is_manager: status[0].is_manager})
}) 

async function changeClerkStatus(request, response, status) {

    var clerk_id = request.body["id"];

    var clerk = await Clerks.getByID(clerk_id);


    // check if clerk exists
    if(clerk == undefined) {
        response.json({error: "Clerk not found"});
        return;
    }

    var status = await Clerks.change_status(clerk_id, status);
    response.status(200).json({message: "Successfully changed clerk visiblilty", enabled: status[0].enabled})
}

// pin must be at least 1 char, an integer & not be undefined
function isPinValid(pin) {
    return pin.length != 0 && pin != undefined;
}

// name must not be undefined, not be blank & be longer than 0 chars
function isClerkNameValid(name) {
    return name != undefined && name.trim() != "" && name.length != 0;
}


module.exports = router