const knex = require('../../database.js')

const CatsProductsLink = {

    createLink: (category_id, product_id) => {
        return knex('cats_products_link')
        .insert({category_id, product_id})
        .returning(['category_id', 'product_id'])
        .catch((err) => {
            console.error("Error creating Category Products Link:")
            console.error(err)
        })
    },

    getAll: () => {
        return knex('cats_products_link').select('*')
    },

    getByProductID: (product_id) => {
        return knex.select('category_id').from('cats_products_link').where({product_id})
    },
    
    getByCatID: (category_id) => {
        return knex.select('product_id').from('cats_products_link').where({category_id})
    },
    
    removeLink: (category_id, product_id) => {
        return knex('cats_products_link').where({category_id, product_id}).del();
    },
    
}

module.exports = CatsProductsLink; 