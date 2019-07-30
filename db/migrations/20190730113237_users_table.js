exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.integer('money');
        table.string('user_name');
        table.integer('game_id').unsigned()
            .references('game_state.id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};