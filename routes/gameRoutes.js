// EXPRESS
const express = require('express');
const app = express.Router();



// MODELS
const knex = require('../config/connection');



// ROUTES
app.get('/api/game_state/:id/users', async (req, res) => {
    try {
        const resUsers = await knex('users').select('*').where('game_id', '=', req.params.id);

        res.status(200).json(resUsers);
    }
    catch (err) {
        res.status(500).end();
        throw err;
    }
});



// EXPORTS
module.exports = app;