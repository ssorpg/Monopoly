// REQUIRES
const knex = require('../config/connection');



// FUNCTIONS
async function getPlayers() {
    return await knex('players').select('*').orderBy('id');
}

async function getPlayer(name) {
    const [player] = await knex('players').select('*').where('name', name);

    return player;
}

async function updatePlayer(player) {
    await knex('players').update(player).where('name', player.name);
}

async function insertPlayer(player) {
    await knex('players').insert(player);
}



// EXPORTS
module.exports = {
    getPlayers: getPlayers,
    getPlayer: getPlayer,
    updatePlayer: updatePlayer,
    insertPlayer: insertPlayer,

    deletePlayer: async function (player) {
        if (player) {
            await knex('players').where('name', player.name).del();
        }

        const players = await getPlayers();

        let reNumber = 1;
        players.forEach(player => {
            player.player_number = reNumber;
            updatePlayer(player);
            reNumber++;
        });

        return players;
    }
};