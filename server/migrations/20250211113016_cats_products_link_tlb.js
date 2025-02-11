/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('cats_products_link', (table) => {
        table.integer('category_id').notNullable().references('id').inTable('categories');
        table.integer('product_id').notNullable().references('id').inTable('products');

        // multi part primary key
        table.primary(['category_id', 'product_id']);

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('cats_products_link');
};
