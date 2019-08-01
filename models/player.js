// MODELS
const knex = require('../config/connection');



// FUNCTIONS
async function getPlayers() {
    const players = await knex('players').select('*');

    return {
        function: 'setPlayers',
        payload: players
    };
}

async function getPlayerByName(playerName) {
    const player = await knex('players').select('*').where('name', '=', playerName);

    return {
        function: 'setPlayers',
        payload: player
    };
}

async function newPlayer(ws) {
    await knex('players').update(ws.player).where('name', '=', ws.player.name);

    return {
        function: 'setPlayer',
        payload: ws.player
    };
}


async function rollDice(player) {
    const rval = {
        die1: 0,
        die2: 0
    };

    rval.die1 = Math.floor((Math.random() * 6) + 1);
    rval.die2 = Math.floor((Math.random() * 6) + 1);

    const dieSum = rval.die1 + rval.die2;

    if (player.position + dieSum > 23) {
        player.position = player.position + dieSum - 23;
    }
    else {
        player.position = player.position + dieSum;
    }

    knex('users').update(player).where('name', '=', player.name);

    player.rval = rval;

    return {
        function: 'setRoll',
        payload: player
    };
}

async function deletePlayer(player) {
    if (player) {
        await knex('players').where('name', '=', player.name).del();
    }
}



// EXPORTS
module.exports = {
    getPlayers: getPlayers,
    getPlayerByName: getPlayerByName,
    newPlayer: newPlayer,
    rollDice: rollDice,
    deletePlayer: deletePlayer
};