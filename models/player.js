// MODELS
const knex = require('../config/connection');



// FUNCTIONS
async function newPlayer(ws, params) {
    const numPlayers = await knex('players').select('*').count('id');

    if (numPlayers > 3) {
        ws.close();
    }
    else {
        await knex('players').insert(params.name);
        const newPlayerID = await knex('players').select('id').orderBy('id').limit(1);

        ws.playerNum = numPlayers + 1;
        ws.userID = newPlayerID;
    }
}

async function getPlayers() {
    const users = await knex('players').select('*');

    return {
        function: 'setPlayers',
        payload: users
    };
}

async function rollDice() {
    var rval = {
        die1: 0,
        die2: 0
    };

    rval.die1 = Math.floor((Math.random() * 6) + 1);
    rval.die2 = Math.floor((Math.random() * 6) + 1);

    return {
        function: 'setRoll',
        payload: rval
    };
}

async function deletePlayer(player_id) {
    if (player_id) {
        await knex('players').where('id', '=', player_id).del();
    }
}



// EXPORTS
module.exports = {
    newPlayer: newPlayer,
    getPlayers: getPlayers,
    rollDice: rollDice,
    deletePlayer: deletePlayer
};