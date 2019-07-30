exports.up = function (knex) {
    return knex.schema.createTable('game_state', table => {
        table.increments('id').primary();
        table.integer('player_ids').unsigned()
            .references('users.id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('game_state');
};