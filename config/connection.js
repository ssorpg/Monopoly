// REQUIRES
const config = require('../knexfile');
const knex = require('knex')(config);



// RESET TABlE
async function resetDB() {
    await knex('players').truncate();
    await knex('tiles').update({ owner: null });
    await knex('game_state').update({ current_player_turn: 1, in_progress: false, paused: false });
}

resetDB();



// FUNCTION CALLS
module.exports = knex;