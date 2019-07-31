// // EXPRESS
// const express = require('express');
// const app = express.Router();



// // MODELS
// const knex = require('../config/connection');



// // ROUTES
// app.get('/api/game_state/:id/users', async (req, res) => {
//     try {
//         const resUsers = await knex('users').select('*').where('game_id', '=', req.params.id);

//         res.status(200).json(resUsers);
//     }
//     catch (err) {
//         res.status(500).end();
//         throw err;
//     }
// });

// app.get('/api/rollDice', async function (req, res) {
//     var rval = {
//         die1: 0,
//         die2: 0
//     };
//     rval.die1 = Math.floor((Math.random() * 6) + 1);
//     rval.die2 = Math.floor((Math.random() * 6) + 1);
//     var dieSum = rval.die1 + rval.die2
//     var position = await knex('users').select('position').where('id', '=', 'id')

//     res.json(rval);
// });



// // EXPORTS
// module.exports = app;