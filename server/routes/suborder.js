// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Suborder related db models
const Suborder = require('../database/models/SuborderModel.js');
const SuborderLine = require('../database/models/SuborderLineModel.js');

// import clerk & order db model
const Clerks = require('../database/models/ClerksModel.js');
const Orders = require('../database/models/OrdersModel.js');

router.get('/get/all', async (request, response) => {
    try {
        var orders = await Suborder.getAll();
        response.json(orders);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve suborders"})
    }
})

router.get('/get/suborder/:id', async (request, response) => {
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

router.get('/get/order/:id', async (request, response) => {
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

router.get('/get/confirmed/:status', async (request, response) => {
    try {

        var status = Boolean(request.params.status);

        var orders = await Suborder.getSubordersByConfirmedStatus(status);

        // if order not found
        if(order == undefined) {
            response.json({error: "Suborders not found"});
            return;
        }

        response.json(order);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve suborder from status provided"})
    }

})

router.post('/create', async (request, response) => {
    try {

        var clerk_id = request.body["clerk_id"];
        var order_id = request.body["order_id"];

        if(order_id == null || order_id == undefined) {
            console.log(`[Suborder > Create] Input validation failed - order undefined`);
            response.status(400).json({error: "Failed to create suborder - order undefined"});
            return;
        }

        // check order exists
        let order = await Orders.getOrderByID(order_id);

        if(order == null || order == undefined) {
            console.log(`[Suborder > Create] Input validation failed - order not found`);
            response.status(400).json({error: "Failed to create suborder - order not found"});
            return;
        }

        // check clerk exists
        let clerk = await Clerks.getByID(clerk_id)

        if(clerk == null || clerk == undefined) {
            console.log(`[Suborder > Create] Input validation failed - clerk not found`);
            response.status(400).json({error: "Failed to create suborder - clerk not found"});
            return;
        }

        // order & clerk both exist, good to open suborder
        let suborder = (await Suborder.create(order_id, clerk_id))[0];
        response.status(200).json({message: "Successfully created new suborder", suborder_details: suborder})
        console.log(`[Suborder > Create] Created new suborder with ID # ${suborder.suborder_id}`)

    } catch(err) {
        console.error(`[Suborder > Create] Error occurred creating suborder:`);
        console.error(err);
        response.status(500).json({error: "Error occurred creating suborder"});
    }
})

router.post('/confirm', async (request, response) => {
    try {

        var suborder_id = request.body["suborder_id"];

        if(suborder_id == null || suborder_id == undefined) {
            console.log(`[Suborder > Confirm] Input validation failed - suborder undefined`);
            response.status(400).json({error: "Failed to confirm suborder - suborder undefined"});
            return;
        }

        // check suborder exists
        let suborder = await Suborder.getSuborderBySuborderID(suborder_id);

        // get 1st result
        suborder = suborder[0];

        if(suborder == null || suborder == undefined) {
            console.log(`[Suborder > Confirm] Input validation failed - suborder not found`);
            response.status(400).json({error: "Failed to confirm suborder - suborder not found"});
            return;
        }
        
        // check if suborder already confirmed
        if(suborder.suborder_confirmed == true) {
            console.log(`[Suborder > Confirm] Cannot confirm suborder - suborder already confirmed`);
            response.status(400).json({error: "Cannot confirm suborder - suborder already confirmed"});
            return;
        }

        // suborder exists & is unconfirmed, good to confirm
        let status = await Suborder.confirmSuborder(suborder_id);

        response.status(200).json({message: "Suborder confirmed", new_details: status[0]})
        console.log(`[Suborder > Confirm] Confirmed suborder ID # ${status[0].suborder_id}`)

    } catch(err) {
        console.error(`[Suborder > Create] Error occurred creating suborder:`);
        console.error(err);
        response.status(500).json({error: "Error occurred creating suborder"});
    }
})

router.get("/line/get/all", async (request, response) => {
    try {
        var lines = await SuborderLine.getAll();
        response.json(lines);
    } catch(error) {
        console.error(error)
        response.status(500).json({error: "Failed to retrieve suborder lines"})
    }
})

router.get("/line/get/line/:id", async (request, response) => {
    try {
        var line = await SuborderLine.getByLineID(request.params.id);

        // if order not found
        if(line == undefined) {
            response.json({error: "No suborder line found"});
            return;
        }

        response.json(line);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve suborder lines from line ID provided"})
    }
})

router.get("/line/get/suborder/:id", async (request, response) => {
    try {
        var line = await SuborderLine.getSubordersByOrderID(request.params.id);

        // if order not found
        if(line == undefined) {
            response.json({error: "No suborder lines found"});
            return;
        }

        response.json(line);
    } catch(error) {
        console.log(error);
        response.status(500).json({error: "Failed to retrieve suborder lines from suborder ID provided"})
    }
})

router.post("/line/comments", async (request, response) => {
    try {

        let line_id = request.body["line_id"];
        let comments = request.body["comments"];

        if(comments == "" || comments == "null") comments = null;

        // check suborder line exists
        let line = SuborderLine.getByLineID(line_id);

        if(line == null || line == undefined) {
            console.log(`[SuborderLine > SetComments] Input validation failed - line not found`);
            response.status(400).json({error: "Failed to update comments for suborder line - line not found"});
            return;
        }

        let db_line_obj = (await SuborderLine.setSuborderLineComments(line_id, comments))[0];
        response.status(200).json({message: "Successfully updated line comments", suborder_line_details: db_line_obj})
        console.log(`[SuborderLine > SetComments] Updated comments for line ID # ${line_id} - New comments: ${db_line_obj.line_comments}`)

    } catch(error) {
        console.error("[SuborderLine > SetComments] Failed to set comments for suborder line:")
        console.log(error);
        response.status(500).json({error: "Failed to set suborder line comments"})
    
    }
})

router.post("/line/create", async (request, response) => {
    try {

        let suborder_id = request.body["suborder_id"];
        let product_id = request.body["product_id"];
        let product_name = request.body["product_name"];
        let product_unit_price = request.body["product_unit_price"];
        let product_qty = request.body["product_qty"];
        let subtotal = request.body["subtotal"];
        let comments = request.body["comments"] == undefined ? null : request.body["comments"];

        console.log(`Received - SUID ${suborder_id}, PID ${product_id}, PN ${product_name}, PQ ${product_qty}, PUP ${product_unit_price}, S ${subtotal}, LC ${comments}`)

        // check suborder exists
        let suborder = Suborder.getSuborderBySuborderID(suborder_id);

        if(suborder == null || suborder == undefined) {
            console.log(`[SuborderLine > Create] Input validation failed - suborder not found`);
            response.status(400).json({error: "Failed to create suborder line - suborder not found"});
            return;
        }

        let line = await SuborderLine.create(
            suborder_id,
            product_id,
            product_name, 
            product_unit_price, 
            product_qty, 
            subtotal,
            comments
        )

        
        response.status(200).json({message: "Successfully created new line", suborder_line: line})
        console.log(`[SuborderLine > Create] Created new line with ID # ${line[0].line_id}`)

    } catch(error) {
        console.error("[SuborderLine > Create] Failed to create suborder line")
        console.log(error);
        response.status(500).json({error: "Failed to create suborder line"})
    
    }
})

router.post("/line/void", async (request, response) => {
    try {

        let line_id = request.body["line_id"];

        // check suborder line exists
        let line = await SuborderLine.getByLineID(line_id);

        if(line == null || line == undefined) {
            console.log(`[SuborderLine > Void] Input validation failed - line not found`);
            response.status(400).json({error: "Failed to void suborder line - line not found"});
            return;
        }

        // check line belong to open order (not closed)
        
        // get suborder from line ID
        let suborder = await Suborder.getSuborderBySuborderID(line.suborder_id)

        // first sql keyword wants to not work for some unknown reason, do this to just get 1st entry
        suborder = suborder[0];

        let order = await Orders.getOrderByID(suborder.order_id);

        // see above comment about sql & first
        order = order[0];

        if(order.is_open != 1 || order.is_open != true) {
            console.log(`[SuborderLine > Void] Void denied - line belongs to a closed order`);
            response.status(400).json({error: "Failed to void suborder line - line belongs to a closed order"});
            return;
        }

        await SuborderLine.void(line_id);
        response.status(200).json({message: "Successfully voided line item"})
        console.log(`[SuborderLine > Void] Voided line ID # ${line_id}`)

    } catch(error) {
        console.error("[SuborderLine > Void] Failed to void suborder line:")
        console.log(error);
        response.status(500).json({error: "Failed to void suborder line"})
    
    }
})

module.exports = router;