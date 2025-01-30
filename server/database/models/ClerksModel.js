const knex = require('../../database.js')

const Clerks = {
    create: (name, pin) => {
        return knex('clerks')
        .insert({name, pin})
        .returning(['id', 'name', 'pin'])
    },

    getAll: () => {
        return knex('clerks').select('*')
    },

    getByPIN: (pin) => {
        return knex('clerks').where({pin}).first()
    },

    update: (id, name, pin) => {
        return knex('clerks').where({id}).update({name, pin}).returning(['id', 'name', 'pin'])
    },

    delete: (id) => {
        return knex('clerks').where({id}).del();
    }
}

module.exports = Clerks;