// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Payment Methods db model
const PaymentMethods = require('../database/models/PaymentMethodsModel.js');

router.get('/get/all', async (request, response) => {
    try {

        let methods = await PaymentMethods.getAll();
        response.status(200).json({methods: methods})

    } catch(err) {
        response.status(500).json({error: "Error retrieving payment methods"})
    }
});

module.exports = router;