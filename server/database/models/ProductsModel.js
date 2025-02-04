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
        return knex('products').where({id}).update({name, price}).returning(['id', 'name', 'price', 'enabled'])
    },

    toggle_status: (id, enabled) => {
        return knex('products').where({id}).update({enabled}).returning(['id', 'name', 'price', 'enabled']);
    }
}

module.exports = Products;