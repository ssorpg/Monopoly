// MODELS
const knex = require('../config/connection');



// EXPORTS
module.exports = {
    getSpace: async function (position) {
        const [curSpace] = await knex('spaces').select('*').where('id', '=', position + 1);
    
        return curSpace;
    }
};