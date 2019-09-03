// REQUIRES
const config = require('../knexfile');
const knex = require('knex')(config);



// RESET TABlE
async function resetDB() {
    await knex.raw('SET foreign_key_checks = 0');
    await knex('players').truncate();
    await knex('games').truncate();
    await knex.raw('SET foreign_key_checks = 1');
    await knex('tiles').update({ owner: null });
    await knex('game_state').update({ current_player_turn: 1, in_progress: false, paused: false });
}

resetDB();



// FUNCTION CALLS
module.exports = knex;
