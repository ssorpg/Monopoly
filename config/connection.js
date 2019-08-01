// REQUIRES
const config = require('../knexfile');
const knex = require('knex')(config);



// RESET TABlE
async function resetDB() {
    await knex('players').truncate();
    await knex('game_state').update({ current_player_turn: 1 });
}

resetDB();



// FUNCTION CALLS
module.exports = knex;