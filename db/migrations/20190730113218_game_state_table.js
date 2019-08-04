exports.up = function (knex) {
    return knex.schema.createTable('game_state', (table) => {
        table.increments('id').primary();
        table.integer('current_player_turn');
        table.boolean('in_progress');
        table.boolean('paused');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('game_state');
};