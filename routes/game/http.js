// MODELS
const knex = require('../../config/connection');



// ROUTES
module.exports = function (app) {
    app.get('/api/game/rollDice', function (req, res) {
        var rval = {
            die1: 0,
            die2: 0
        };
        rval.die1 = Math.floor((Math.random() * 6) + 1);
        rval.die2 = Math.floor((Math.random() * 6) + 1);

        console.log(rval.die1);

        res.json(rval);
    });
};