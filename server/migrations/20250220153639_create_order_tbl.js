/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', (table) => {
        table.increments('id').primary();
        table.string('order_name');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.integer('created_by').notNullable().references('clerks').inTable('id');
        table.boolean('is_open').notNullable().defaultTo(true);
        table.boolean('is_paid').notNullable().defaultTo(false);
        table.integer('payment_method').notNullable().references('payment_methods').inTable('id');
        table.integer('table_id').references('tables').inTable('id'); // nullable - null = quick sale
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orders')
};
