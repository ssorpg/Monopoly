// REQUIRES
const config = require('../knexfile');
const knex = require('knex')(config);



// RESET TABlE
async function resetPlayers() {
    await knex('players').truncate();
}

resetPlayers();



// FUNCTION CALLS
module.exports = knex;