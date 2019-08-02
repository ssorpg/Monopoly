// MODELS
const knex = require('../config/connection');



// FUNCTIONS
async function getPlayers() {
    return await knex('players').select('*').orderBy('id', 'desc');
}

async function updatePlayer(player) {
    await knex('players').update(player).where('name', '=', player.name);
}



// EXPORTS
module.exports = {
    getPlayers: getPlayers,

    updatePlayer: updatePlayer,
    
    deletePlayer: async function (player) {
        if (player) {
            await knex('players').where('name', '=', player.name).del();
        }

        const players = await getPlayers();

        let reNumber = 1;
        players.forEach(async player => {
            player.player_number = reNumber;
            await updatePlayer(player);
            reNumber++;
        });

        return {
            function: 'setPlayers',
            payload: players
        };
    }
};