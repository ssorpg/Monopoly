// EXPRESS
const express = require('express');
const app = express.Router();



// MODELS
const knex = require('../config/connection');



// ROUTES
app.get('/api/users', async (req, res) => {
    try {
        const resUsers = await knex('users');

        res.status(200).json(resUsers);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});

app.post('/api/users', async (req, res) => {
    if (req.body.username.length < 1 || req.body.username.length > 20) {
        return res.status(400).send('Please enter a username between 1 and 20 characters');
    }

    try {
        const found = await knex.from('users').select('id').where('username', '=', req.body.username);

        if (found === null) {
            await knex('users').insert(req.body);
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
        const resUser = await knex.from('users').select('*').where('id', '=', req.params.id);

        res.status(200).json(resUser);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const resUser = await knex('users').where('id', '=', req.body.id).update(req.body).returning();

        res.status(200).json(resUser);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});



// EXPORTS
module.exports = app;