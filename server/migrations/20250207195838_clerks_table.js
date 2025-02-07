/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('clerks', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('pin').notNullable();
        table.boolean('enabled').notNullable().defaultTo(true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('clerks');
};
