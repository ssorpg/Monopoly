exports.up = function (knex) {
    return knex.schema.createTable('players', (table) => {
        table.increments('id');
        table.integer('player_number');
        table.string('name').primary(); // We can be certain this name will always be unique
        table.integer('money');
        table.integer('position');
        table.string('hash');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};