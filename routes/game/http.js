// MODELS
const knex = require('../../config/connection');



// ROUTES
module.exports = function(app) {
    app.post('/api/players', async function (req, res) {
        const players = await knex('players').select('*');
    
        if (players.length > 3) {
            res.status(400).send('The game is full.');
        }
        // else if (players.includes(req.query.name)) {
        //     res.status(400).send('Someone has already selected that name, please choose a different one.');
        // }
        else {
            await knex('players').insert(req.query.name);
        }
    });
};