// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Orders & Clerks db model
const Orders = require('../database/models/OrdersModel.js');
const Clerks = require('../database/models/ClerksModel.js');

router.get('/get/all', async (request, response) => {
    try {
        var orders = await Orders.getAllOrders();
        response.json(orders);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve orders"})
    }
})

router.get('/get/:id', async (request, response) => {
    try {
        var order = await Orders.getOrderByID(request.params.id);

        // if order not found
        if(order == undefined) {
            response.json({error: "Order not found"});
            return;
        }

        response.json(order);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve order from ID provided"})
    }

})

router.get('/get/table/:id', async (request, response) => {
    try {
        var orders = await Orders.getOrdersByTableID(request.params.id);

        // if order not found
        if(orders == undefined || orders.length == 0) {
            response.json({error: "No orders found for specified table ID"});
            return;
        }

        response.status(200).json(order);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve orders from table ID provided"})
    }

})

router.get('/get/is_open/:status', async (request, response) => {
    try {

        var status = request.params.status;
        if(status.toLowerCase() === 'true') status = true;
        if(status.toLowerCase() === 'false') status = false;

        if(typeof status != "boolean") {
            // input validation failed
            response.status(400).json({error: "Failed to retrieve orders by status - invalid input"});
            return;
        }

        var orders = await Orders.getOrdersByOrderStatus(status);

        // if orders not found
        if(orders == undefined || orders.length == 0) {
            response.json({error: "No orders found"});
            return;
        }

        return orders;


    } catch(err) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve orders from status provided"})
    }
})

router.post('/create', async (request, response) => {

    try {

        var clerk_id = request.body["clerk_id"];
        var table_id = request.body["table_id"];
        var order_name = request.body["order_name"];

        // parse table id - set to null if undefined
        if(table_id == undefined || table_id.trim() == '') {
            table_id = null;
        }

        // parse order name - set to null if undefined
        if(order_name == undefined || order_name.trim() == '') {
            order_name = null;
        }

        // check clerk ID exists
        var clerk = await Clerks.getByID(clerk_id);
        if(clerk == null || clerk == undefined) {
            console.log("[Orders > Create] Failed to create order - clerk ID not found")
            response.status(400).json({error: "Failed to create order - clerk not found"});
            return;
        }

        var order = (await Orders.create(clerk_id, table_id, order_name))[0];
        response.status(200).json({message: "Successfully created order", order_data: order})

    } catch(err) {
        console.log(err);
        response.status(500).json({error: "Failed to create order"});
    }


})

module.exports = router;