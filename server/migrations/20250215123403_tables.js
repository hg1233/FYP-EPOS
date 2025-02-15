/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tables', (table) => {
        table.increments('id').primary();
        table.string('display_name');
        table.integer('seats').notNullable();
        table.boolean('enabled').notNullable().defaultTo(true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('tables');
};
