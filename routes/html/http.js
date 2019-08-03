// REQUIRES
const path = require('path');
const playerModel = require('../../models/player');



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

    app.get('/game', async function (req, res) {
        try {
            const players = await playerModel.getPlayers();

            let isValid = false;

            players.forEach(player => {
                if (player.name === req.query.name && player.hash === req.query.hash) {
                    res.status(200).sendFile('view/game/game.html', { root: path.dirname('../') });
                    isValid = true;
                    return;
                }
            });

            if (!isValid) {
                res.status(403).end();
            }
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