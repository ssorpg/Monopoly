// EXPRESS
const express = require('express');
const app = express.Router();



// MODELS
const Users = require('../models/user');



// ROUTES
app.get('/', async (req, res) => {
    try {
        const resUsers = await Users('users');

        res.status(200).json(resUsers);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});



// EXPORTS
module.exports = app;