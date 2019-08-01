// MODELS
const knex = require('../config/connection');



// FUNCTIONS
async function checkSpace(position) {
    const [curSpace] = await knex('spaces').select('*').where('id', '=', position + 1);

    return curSpace;
}



// EXPORTS
module.exports = {
    checkSpace: checkSpace
};