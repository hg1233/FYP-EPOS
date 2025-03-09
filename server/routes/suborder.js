// import express
const express = require('express');

// import db connection
const db = require('../database.js');

// setup route handler
const router = express.Router();

// import Suborder related db models
const Suborder = require('../database/models/SuborderModel.js');
const SuborderLine = require('../database/models/SuborderLineModel.js');
