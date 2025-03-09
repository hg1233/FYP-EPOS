/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('suborder_line', (table) => {
        table.increments('line_id').primary();
        table.integer('suborder_id').notNullable().references('suborder').inTable('suborder_id');
        table.integer('product_id').notNullable(); // does not reference (data warehousing)
        table.string('product_name').notNullable(); // does not reference (data warehousing)
        table.integer('product_unit_price').notNullable(); // does not reference (data warehousing)
        table.integer('product_qty').notNullable(); // does not reference (data warehousing)
        table.integer('subtotal').notNullable(); // does not reference (data warehousing)
        table.string('line_comments'); // can be null
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('suborder_line');
};
