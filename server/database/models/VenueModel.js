const knex = require('../../database.js')

const Venue = {

    add: (attribute, value) => {
        return knex('venue')
        .insert({attribute, value})
        .returning(['attribute', 'value'])
    },

    getAll: () => {
        return knex('venue').select('*')
    },

    getByAttribute: (attribute) => {
        return knex('venue').where({attribute}).first()
    },

    update: (attribute, value) => {
        return knex('venue').where({attribute}).update({value}).returning(['attribute', 'value'])
    }
    
}