// MODELS
const knex = require('../config/connection');



// FUNCTIONS
async function checkSpace(player) {
    const [curSpace] = await knex('spaces').select('*').where('id', '=', player.position + 1);

    player.money += curSpace.money_gained;
    player.money -= curSpace.money_lost;

    return player;
}



// EXPORTS
module.exports = {
    checkSpace: checkSpace
};