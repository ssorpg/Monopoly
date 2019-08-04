exports.up = function (knex) {
    return knex.schema.createTable('tiles', (table) => {
        table.increments('id').primary();
        table.integer('position');
        table.string('type');
        table.integer('money_lost');
        table.integer('property_cost');
        table.string('name');
        table.string('description');
        table.string('owner');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tiles');
}; 