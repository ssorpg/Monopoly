const knex = require('../config/connection');
require('dotenv').config();


module.exports = {
  get: async function(id) {
    let promise = knex('game_state').select('*');

    if(id) {
      promise.where('id', id);
    }

    return await promise;
  }
}
