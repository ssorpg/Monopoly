// EXPRESS
const express = require('express');
const app = express.Router();



// MODELS
const Knex = require('../config/connection');



// ROUTES
app.get('/api/users', async (req, res) => {
    try {
        const resUsers = await Knex.findAll();

        res.status(200).json(resUsers);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});

app.post('/api/users', async (req, res) => {
    if (req.body.user_name.length < 1 || req.body.user_name.length > 20) {
        return res.status(400).send('Please enter a username between 1 and 20 characters');
    }

    try {
        const found = await Knex.findOne({
            where: {
                user_name: req.body.user_name
            }
        });

        if (found === null) {
            await Knex.create(req.body);
        }

        res.status(200).end();
    }
    catch (err) {
        res.status(500).end();
        console.log(err);
        throw err;
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const resUser = await Knex.findOne({
            where: {
                id: req.params.id
            }
        });

        res.status(200).json(resUser);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});



// EXPORTS
module.exports = app;