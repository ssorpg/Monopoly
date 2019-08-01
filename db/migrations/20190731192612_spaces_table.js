exports.up = function (knex) {
    return knex.schema.createTable('spaces', table => {
        table.increments('id').primary();
        table.integer('money_lost');
        table.integer('money_gained');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('spaces');
};