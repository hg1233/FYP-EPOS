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

    getByID: (id) => {
        return knex('products').where({id}).first()
    },

    update: (id, name, price) => {
        return knex('products').where({id}).update({name, price, enabled}).returning(['id', 'name', 'price', 'enabled'])
    },

    delete: (id) => {
        return knex('products').where({id}).del();
    }
}

module.exports = Products;