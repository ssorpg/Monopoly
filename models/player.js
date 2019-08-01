// MODELS
const knex = require('../config/connection');



// FUNCTIONS
async function getPlayers() {
    return await knex('players').select('*').orderBy('id', 'desc');
}

async function updatePlayer(player, wait) {
    if (wait) {
        await knex('players').update(player).where('name', '=', player.name);
    }
    else {
        knex('players').update(player).where('name', '=', player.name);
    }
}



// EXPORTS
module.exports = {
    getPlayers: getPlayers,

    getPlayersResponse: async function () {
        const players = await getPlayers();
    
        return {
            function: 'setPlayers',
            payload: players
        };
    },
    
    getPlayerByName: async function (playerName) {
        const player = await knex('players').select('*').where('name', '=', playerName);
    
        return {
            function: 'setPlayers',
            payload: player
        };
    },

    updatePlayer: updatePlayer,
    
    deletePlayer: async function (player) {
        if (player) {
            await knex('players').where('name', '=', player.name).del();
        }

        const players = await getPlayers();

        let reNumber = 1;
        players.forEach(player => {
            player.player_number = reNumber;
            updatePlayer(player);
            reNumber++;
        });

        return {
            function: 'setPlayers',
            payload: players
        };
    }
};