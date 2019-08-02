// MODELS
const knex = require('../config/connection');



// EXPORTS
module.exports = {
    getTile: async function (position) {
        const [curTile] = await knex('tiles').select('*').where('position', '=', position);

        return curTile;
    }
}; 