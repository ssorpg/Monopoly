exports.up = function (knex) {
    return knex.schema.createTable('tiles', (table) => {
        table.increments('id').primary();
        table.integer('position');
        table.string('type');
        table.integer('money_lost');
        table.integer('money_gained');
        table.integer('property_cost');
        table.string('description');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tiles');
}; 