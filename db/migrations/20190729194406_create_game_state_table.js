exports.up = function (knex, Promise) {
    return knex.schema.createTable('game_state', table => {
        table.increments('id').primary();
        table.integer('player_ids').unsigned()
            .references('users.id');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('game_state');
};