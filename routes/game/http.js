// MODELS
const path = require('path');
const knex = require('../../config/connection');



// ROUTES
module.exports = function (app) {
    app.post('/api/players', async function (req, res) {
        try {
            const players = await knex('players').select('*');

            const alreadyHasName = players.forEach(player => {
                if (player.name === req.query.name) {
                    return true;
                }
            });

            if (players.length > 3) {
                res.status(400).send('The game is full.');
            }
            else if (alreadyHasName) {
                res.status(400).send('Someone has already selected that name, please choose a different one.');
            }
            else {
                await knex('players').insert(req.query.name);

                res.status(200).sendFile('view/game/game.html', { root: path.dirname(__dirname) });
            }
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.get('game.js', function (req, res) {
        try {
            res.status(200).sendFile('view/game/game.js', { root: path.dirname(__dirname) });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.get('styles.css', function (req, res) {
        try {
            res.status(200).sendFile('view/game/styles,css', { root: path.dirname(__dirname) });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });
};