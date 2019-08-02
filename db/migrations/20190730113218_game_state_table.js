exports.up = function (knex) {
    return knex.schema.createTable('game_state', table => {
        table.increments('id').primary();
        table.boolean('in_progress');
        table.integer('current_player_turn');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('game_state');
};