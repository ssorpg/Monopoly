// EXPRESS
const express = require('express');
const app = express.Router();
const path = require("path");



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
    try {
        users = req.body["players[]"];
        console.log(users);
        for (let i = 0; i < users.length; i++) {
            const found = await knex.from('users').select('id').where('user_name', '=', users[i]);
            if (found.length === 0) {
                await knex('users').insert({
                    money : 10000,
                    user_name : users[i],
                    game_id : 1,
                    position : 18
                });
            }
        }

        res.sendFile(path.join(__dirname + "/../public/game/game.html"));
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