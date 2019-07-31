// MODELS
// const Knex = require('../config/connection');
const path = require('path');



// ROUTES
module.exports = function (app) {
    app.get('/', async (req, res) => {
        try {
            // TODO(?): Do we need to clear all the tables when "/" is requested?
            res.status(200).sendFile(path.join(__dirname + '/../../public/index/login.html'));
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });
};