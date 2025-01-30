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

module.exports = router