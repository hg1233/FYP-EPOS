/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('clerks', (table) => {
        table.boolean('is_manager').notNullable().defaultTo(false);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('clerks', (table) => {
        table.dropColumn('is_manager');
    })
};
