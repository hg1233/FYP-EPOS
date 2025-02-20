const knex = require('../../database.js')

const Products = {
    create: (name, price) => {
        return knex('products')
        .insert({name, price})
        .returning(['id', 'name', 'price', 'enabled'])
    },

    getAll: () => {
        return knex('products').select('*')
    },

    getAllWithCategoryData: () => {
        return knex('products').select('products.*', knex.raw('GROUP_CONCAT(categories.id) as categories'))
        .leftJoin('cats_products_link', 'products.id', 'cats_products_link.product_id')
        .leftJoin('categories', 'cats_products_link.category_id', 'categories.id')
        .groupBy('products.id')
        .then((response) => {

            response.forEach(entry => {
                // sql outputs just as a concatenated string, parse/convert to list
                if(typeof entry.categories == "string") {
                    Object.assign(entry, {categories: entry.categories.split(',')})
                }
            });

            return response;

            
        })
    },

    getByID: (id) => {
        return knex('products').where({id}).first()
    },

    update: (id, name, price) => {
        return knex('products').where({id}).update({name, price}).returning(['id', 'name', 'price', 'enabled'])
    },

    toggle_status: (id, enabled) => {
        return knex('products').where({id}).update({enabled}).returning(['id', 'name', 'price', 'enabled']);
    }
}

module.exports = Products;