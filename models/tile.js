// MODELS
const knex = require('../config/connection');



// EXPORTS
module.exports = {
    getTile: async function (position) {
        const [tile] = await knex('tiles').select('*').where('position', position);

        return tile;
    },

    updateTile: async function (tile) {
        await knex('tiles').update(tile).where('position', tile.position);
    },

    askToBuy: function (tile) {
        return 'Purchase ' + tile.name + ' for ' + tile.property_cost + '?';
    }
}; 