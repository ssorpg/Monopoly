// MODELS
const knex = require('../config/connection');



// EXPORTS
module.exports = {
    getTiles: async function () {
        return await knex('tiles').select('*');
    },
    
    getTile: async function (position) {
        const [tile] = await knex('tiles').select('*').where('position', position);

        return tile;
    },

    updateTile: async function (tile) {
        await knex('tiles').update(tile).where('position', tile.position);
    },

    removeTileOwnership: async function (player) {
        await knex('tiles').update('owner', null).where('owner', player.name);
    }
}; 