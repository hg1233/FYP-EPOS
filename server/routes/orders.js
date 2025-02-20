// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Orders db model
const Orders = require('../database/models/OrdersModel.js');

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
        response.status(500).json({error: "Failed to retrieve order from table ID provided"})
    }

})


module.exports = router;