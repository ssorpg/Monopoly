// REQUIRES
const knex = require('../../config/connection');



// ROUTES
module.exports = function (app) {
    app.post('/api/players', async (req, res) => {
        try {
            const players = await knex('players').select('*');

            if (players.length > 3) {
                res.status(400).send('The game is full.');
                return;
            }

            const [alreadyHasName] = players.filter(player => { return player.name === req.body.name; });

            if (alreadyHasName) {
                res.status(400).send('Someone has already selected that name, please choose a different one.');
                return;
            }

            let hash = 0, i, chr;

            for (i = 0; i < req.body.name.length; i++) {
                chr = req.body.name.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            const newPlayer = {
                name: req.body.name,
                money: 1500,
                position: 0,
                hash: hash
            };

            await knex('players').insert(newPlayer);

            res.status(200).send(hash.toString());
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });
};