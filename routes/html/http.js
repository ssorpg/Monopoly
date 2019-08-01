// REQUIRES
const path = require('path');



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