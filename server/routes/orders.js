// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Orders, SuborderLine, PaymentMethods, Tables & Clerks db model
const Orders = require('../database/models/OrdersModel.js');
const SuborderLine = require('../database/models/SuborderLineModel.js');
const PaymentMethods = require('../database/models/PaymentMethodsModel.js');
const Clerks = require('../database/models/ClerksModel.js');
const Tables = require('../database/models/TablesModel.js');
const Suborder = require('../database/models/SuborderModel.js');

router.get('/get/all', async (request, response) => {
    try {
        var orders = await Orders.getAllOrdersWithSuborders();

        // add in suborder line details for each order
        for(let o_index = 0; o_index < orders.length; o_index++) {

            let order = orders[o_index];

            order.suborders = await Suborder.getSubordersByOrderID(order.id);

            for(let s_index = 0; s_index < order.suborders.length; s_index++) {
                let suborder = order.suborders[s_index];

                suborder.lines = await SuborderLine.getLinesBySuborderID(suborder.suborder_id);

            }
        }

        response.json(orders);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve orders"})
    }
})

router.get('/get/:id', async (request, response) => {
    try {
        var order = await Orders.getOrderByIDWithSuborders(request.params.id);

        // if order not found
        if(order == undefined) {
            response.json({error: "Order not found"});
            return;
        }

        // add in suborder line details

        for(let index = 0; index < order.suborders.length; index++) {

            let suborder = order.suborders[index];
            suborder.lines = await SuborderLine.getLinesBySuborderID(suborder.suborder_id);
        }

        response.json(order);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve order from ID provided"})
    }

})

router.get('/get/table/:id', async (request, response) => {
    try {
        var orders = await Orders.getOrdersByTableIDWithSuborders(request.params.id);

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

        if(status.toString().toLowerCase() === 'true') { status = true; }
        if(status.toString().toLowerCase() === 'false') { status = false; }

        if(typeof status != "boolean") {
            // input validation failed
            response.status(400).json({error: "Failed to retrieve orders by status - invalid input"});
            return;
        }

        var orders = await Orders.getOrdersByOrderStatusWithSuborders(status);

        // if orders not found
        if(orders == undefined || orders.length == 0) {
            response.json({error: "No orders found"});
            return;
        }

        // add in suborder line details for each order
        for(let o_index = 0; o_index < orders.length; o_index++) {

            let order = orders[o_index];

            order.suborders = await Suborder.getSubordersByOrderID(order.id);

            for(let s_index = 0; s_index < order.suborders.length; s_index++) {
                let suborder = order.suborders[s_index];

                suborder.lines = await SuborderLine.getLinesBySuborderID(suborder.suborder_id);

            }
        }

        response.json(orders);


    } catch(err) {
        console.log(err);
        response.status(500).json({error: "Failed to retrieve orders from status provided"})
    }
})

router.post('/create', async (request, response) => {

    try {

        var clerk_id = request.body["clerk_id"];
        var table_id = (request.body["table_id"] != undefined ? request.body["table_id"].toString() : null);
        var order_name = request.body["order_name"];

        // parse table id - set to null if undefined
        if(table_id == undefined || (typeof table_id == "string" && table_id.trim() == '')) {
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

router.post('/set_table', async (request, response) => {

    try {

        var table_id = request.body["table_id"];
        var order_id = request.body["order_id"];

        var table = await Tables.getByID(table_id);
        var order = await Orders.getOrderByID(order_id);

        // check table & order exist
        if(table == null || order == null) {
            console.log(`[Orders > Assign to Table] Unable to assign order ${order_id} to table ${table_id} - table or order not found`)
            response.status(400).json({error: "Table or order not found"})
            return;
        }

        // check if order already closed
        if(order.is_open != true) {
            console.log(`[Orders > Assign to Table] Order ${order_id} cannot be assigned to table ${table_id} - order already closed`)
            response.status(400).json({error: "Cannot assign order to table - order already closed"})
            return;
        }

        var update = await Orders.setTable(order_id, table_id);
        response.status(200).json({message: "Successfully assigned order to table", order_details: update});



    } catch(err) {
        console.log(err);
        response.status(500).json({error: "Error assigning order to table"})
    }

})

router.post('/set_name', async (request, response) => {

    try {

        var order_id = request.body["order_id"];
        var name = request.body["name"];
        var order = await Orders.getOrderByID(order_id);

        // check order exists
        if(order == null) {
            console.log(`[Orders > Set Name] Unable to set name for order ${order_id} - order not found`)
            response.status(400).json({error: "Order not found"})
            return;
        }

        // check if order already closed
        if(order.is_open != true) {
            console.log(`[Orders > Set Name] Order name for order # ${order_id} cannot be changed - order already closed`)
            response.status(400).json({error: "Cannot change order name - order already closed"})
            return;
        }

        var update = await Orders.setName(order_id, name);
        response.status(200).json({message: "Successfully set name for order", order_details: update});



    } catch(err) {
        console.log(err);
        response.status(500).json({error: "Error setting order name"})
    }

})

router.post('/pay/:id', async (request, response) => {

    try { 
        
        var order_id = request.params.id;
        var order = await Orders.getOrderByID(order_id);

        // check order id valid
        if(order == null || order == undefined) {
            console.log(`[Orders > Pay] Failed to mark order # ${order_id} as paid - order not found`)
            response.status(400).json({error: "Failed to mark order as paid - order not found"});
            return;
        }

        // check if payment method defined
        var method_id = request.body["payment_method"];
        var method = await PaymentMethods.getByID(method_id);
        if(method == null || method == undefined) {
            console.log(`[Orders > Pay] Failed to mark order as paid - payment method not found`);
            response.status(400).json({error: "Failed to mark order as paid - payment method not found"});
            return
        }

        // check if order is already paid
        if(order.is_paid == 1 || order.is_paid == true) {
            console.log(`[Orders > Pay] Failed to mark order # ${order_id} as paid - order is already paid`)
            response.status(400).json({error: "Failed to mark order as paid - order is already marked as paid"});
            return;
        }

        var update = await Orders.markAsPaidAndCloseOrder(order_id, true, method_id);
        response.status(200).json({message: "Marked order as paid", order_details: update});

    } catch(err) {
        console.log(err);
        response.status(500).json({error: "Failed to mark order as paid"})
    }

})

module.exports = router;