// REQUIRES
const config = require('./config');
const knex = require('knex')(config);



// FUNCTION CALLS
module.exports = knex;