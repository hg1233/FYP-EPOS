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