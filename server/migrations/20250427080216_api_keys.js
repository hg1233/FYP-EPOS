/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('api_keys', (table) => {
        table.string('api_key').primary();
        table.string('name').notNullable();
        table.boolean('enabled').notNullable().defaultTo(true);
        table.integer('last_heartbeat');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('categories');
};
