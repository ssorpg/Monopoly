// MODELS
const path = require('path');
const knex = require('../../config/connection');



// ROUTES
module.exports = function (app) {
    app.get('/', function (req, res) {
        try {
            res.status(200).sendFile('view/login/login.html', { root: path.dirname('../') });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.get('/login.js', function (req, res) {
        try {
            res.status(200).sendFile('view/login/login.js', { root: path.dirname('../') });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.get('/login.css', function (req, res) {
        try {
            res.status(200).sendFile('view/login/login.css', { root: path.dirname('../') });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.post('/api/players', async function (req, res) {
        try {
            const players = await knex('players').select('*');

            const alreadyHasName = players.forEach(player => {
                if (player.name === req.query.name) {
                    return true;
                }
            });

            const newPlayer = {
                name: req.body.name,
                money: 1500,
                position: 0
            }

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

    app.get('/game', function (req, res) {
        try {
            res.status(200).sendFile('view/game/game.html', { root: path.dirname('../') });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.get('/game.js', function (req, res) {
        try {
            res.status(200).sendFile('view/game/game.js', { root: path.dirname('../') });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.get('/game.css', function (req, res) {
        try {
            res.status(200).sendFile('view/game/game.css', { root: path.dirname('../') });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });

    app.get('/images/:name', function (req, res) {
        try {
            res.status(200).sendFile('view/images/' + req.params.name, { root: path.dirname('../') });
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });
};