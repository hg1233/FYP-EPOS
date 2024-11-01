// import express
const express = require('express');

// import db connection
const db = require('./database.js');

// setup route handler
const router = express.Router();

// endpoint to retrieve all products
app.get("/get_all", (request, response) => {
    products = [
        {
            "product_id": 1,
            "product_name": "Pint of Beer",
            "product_price": 450,
            "product_enabled": true,
        },
        {
            "product_id": 2,
            "product_name": "Half Pint of Beer",
            "product_price": 230,
            "product_enabled": true,
        },
    ]

    response.send(products);
})