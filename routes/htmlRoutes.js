// EXPRESS
const express = require('express');
const app = express.Router();



// MODELS
const Knex = require('../config/connection');



// ROUTES
app.get('/', async (req, res) => {
    try {
        const resUsers = await Knex('users');

        res.status(200).json(resUsers);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});



// EXPORTS
module.exports = app;