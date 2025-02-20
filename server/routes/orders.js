// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Orders db model
const Orders = require('../database/models/OrdersModel.js');




module.exports = router;