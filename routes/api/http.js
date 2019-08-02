// REQUIRES
const knex = require('../../config/connection');



// ROUTES
module.exports = function(app) {
    app.post('/api/players', async function (req, res) {
        try {
            const players = await knex('players').select('*');

            const [alreadyHasName] = players.filter(player => { return player.name === req.body.name; });

            const newPlayer = {
                name: req.body.name,
                money: 1500,
                position: 1
            };

            if (players.length > 3) {
                res.status(400).send('The game is full.');
            }
            else if (alreadyHasName) {
                res.status(400).send('Someone has already selected that name, please choose a different one.');
            }
            else {
                await knex('players').insert(newPlayer);

                res.status(200).end();
            }
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });
};