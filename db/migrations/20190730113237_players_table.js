exports.up = function (knex) {
    return knex.schema.createTable('players', table => {
        table.increments('id').primary();
        table.integer('player_number');
        table.string('name');
        table.integer('money');
        table.integer('position');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};