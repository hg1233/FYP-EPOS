// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Suborder related db models
const Suborder = require('../database/models/SuborderModel.js');
const SuborderLine = require('../database/models/SuborderLineModel.js');

router.get('/get/all', async (request, response) => {
    try {
        var orders = await Suborder.getAll();
        response.json(orders);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve suborders"})
    }
})

router.get('/get_by_suborder_id/:id', async (request, response) => {
    try {
        var order = await Suborder.getSuborderBySuborderID(request.params.id);

        // if order not found
        if(order == undefined) {
            response.json({error: "Suborder not found"});
            return;
        }

        response.json(order);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve suborder from suborder ID provided"})
    }

})

router.get('/get_by_order_id/:id', async (request, response) => {
    try {
        var orders = await Suborder.getSubordersByOrderID(request.params.id);

        // if order not found
        if(orders == undefined) {
            response.json({error: "No suborders found"});
            return;
        }

        response.json(orders);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve suborders from order ID provided"})
    }

})

router.get('/get/clerk/:id', async (request, response) => {
    try {
        var orders = await Suborder.getSubordersByClerk(request.params.id);

        // if order not found
        if(order == undefined) {
            response.json({error: "Suborders not found"});
            return;
        }

        response.json(order);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve suborder from clerk ID provided"})
    }

})
