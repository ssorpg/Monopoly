exports.up = function (knex) {
    return knex.schema.createTable('players', table => {
        table.increments('id').primary();
        table.integer('money');
        table.string('name');
        table.integer('position');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};