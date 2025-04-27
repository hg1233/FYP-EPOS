const knex = require('../../database.js')

const Categories = {

    create: (name) => {
        return knex('categories')
        .insert({name})
        .returning(['id', 'name', 'priority', 'enabled'])
    },

    getAll: () => {
        return knex('categories').select('*').orderBy('priority', 'asc') // lower the priority = higher up the list
    },

    getAllWithProductData: () => {
        return knex('categories').select('categories.*', knex.raw('GROUP_CONCAT(products.id) as products'))
        .leftJoin('cats_products_link', 'categories.id', 'cats_products_link.category_id')
        .leftJoin('products', 'cats_products_link.product_id', 'products.id')
        .groupBy('categories.id')
        .then((response) => {

            response.forEach(entry => {
                // sql outputs just as a concatenated string, parse/convert to list
                if(typeof entry.products == "string") {
                    Object.assign(entry, {products: entry.products.split(',')})
                }
            });

            return response;

            
        })
    },

    getByID: (id) => {
        return knex('categories').where({id}).first()
    },

    getByName: (name) => {
        return knex('categories').where({name}).first()
    },

    change_name: (id, name) => {
        return knex('categories').where({id}).update({name}).returning(['id', 'name', 'priority', 'enabled'])
    },

    change_priority: (id, priority) => {
        return knex('categories').where({id}).update({priority}).returning(['id', 'name', 'priority', 'enabled'])
    },

    change_status: (id, enabled) => {
        return knex('categories').where({id}).update({enabled}).returning(['id', 'name', 'priority', 'enabled'])
    }
    
}

module.exports = Categories;