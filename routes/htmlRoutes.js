// EXPRESS
const express = require('express');
const app = express.Router();



// MODELS
const Knex = require('../config/connection');
const path = require('path');


// ROUTES
app.get('/', async (req, res) => {
    try {
        // TODO(?): Do we need to clear all the tables when "/" is requested?
        res.sendFile(path.join(__dirname + "/../public/index/login.html"));
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});



// EXPORTS
module.exports = app;