
exports.up = function(knex) {
  return knex.schema.createTable('games', (table) => {
      table.increments('id').primary();
      table.integer('player_id').unsigned();
      table.foreign('player_id').references('Players.id')
  });
};

exports.down = function(knex) {
      return knex.schema.dropTable('games');
};
