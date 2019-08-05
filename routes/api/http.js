// MODELS
const playerModel = require('../../models/player');
const gameModel = require('../../models/game_state');



// FUNCTIONS
async function checkLogin(name) {
    if (name.length < 1) {
        return 'Please enter a name.';
    }

    const players = await playerModel.getPlayers();

    if (players.length > 3) {
        return 'The game is full.';
    }

    const [alreadyHasName] = players.filter(player => { return player.name === name; });

    if (alreadyHasName) {
        return 'Someone has already selected that name, please choose a different one.';
    }

    const game_state = await gameModel.getGameState();

    if (game_state.in_progress) {
        return 'The game has already started.';
    }
}



// ROUTES
module.exports = function (app) {
    app.post('/api/players', async (req, res) => {
        try {
            const newName = req.body.name;
            const cantLogin = await checkLogin(newName);

            if (cantLogin) {
                return res.status(400).send(cantLogin);
            }

            let hash = 0, i, chr;

            for (i = 0; i < newName.length; i++) {
                chr = newName.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            const newPlayer = {
                name: newName,
                money: 1500,
                position: 0,
                hash: hash
            };
            await playerModel.insertPlayer(newPlayer);

            res.status(200).send(hash.toString());
        }
        catch (err) {
            res.status(500).end();
            throw err;
        }
    });
};