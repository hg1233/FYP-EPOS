/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('suborder', (table) => {
        table.increments('suborder_id');
        table.integer('order_id').notNullable().references('orders').inTable('id');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.integer('created_by').notNullable().references('clerks').inTable('id');
        table.boolean('suborder_confirmed').notNullable().defaultTo(false); // i.e. table store
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('suborder');
};
