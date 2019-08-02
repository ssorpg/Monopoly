// MODELS
const knex = require('../config/connection');



// EXPORTS
module.exports = {
    getTile: async function (position) {
        const [curTtile] = await knex('tiles').select('*').where('id', '=', position);

        return curTtile;
    }
}; 