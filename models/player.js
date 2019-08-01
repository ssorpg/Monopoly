// MODELS
const knex = require('../config/connection');



// FUNCTIONS
async function getPlayerList() {
    return await knex('players').select('*').orderBy('id', 'desc');
}



// EXPORTS
module.exports = {
    getPlayers: async function () {
        const players = await getPlayerList();
    
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

    getLastPlayer: async function () {
        const [newPlayer] = await knex('players').select('*').orderBy('id', 'desc').limit(1);
        return newPlayer;
    },

    getNumPlayers: async function () {
        const players = await getPlayerList();

        return players.length || 1;
    },

    updatePlayer: async function(player) {
        await knex('players').update(player).where('name', '=', player.name);
    },
    
    deletePlayer: async function (player) {
        if (player) {
            await knex('players').where('name', '=', player.name).del();
        }

        const players = await getPlayerList();

        let reNumber = 1;
        players.forEach(player => {
            player.player_number = reNumber;

            reNumber++;
        });

        return {
            function: 'setPlayers',
            payload: players
        };
    }
};