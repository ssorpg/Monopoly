exports.up = function (knex) {
    return knex.schema.createTable('game_state', table => {
        table.increments('id').primary();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('game_state');
};