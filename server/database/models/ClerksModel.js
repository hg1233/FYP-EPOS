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

    getByID: (id) => {
        return knex('clerks').where({id}).first()
    },

    update: (id, name, pin) => {
        return knex('clerks').where({id}).update({name, pin}).returning(['id', 'name', 'pin', 'enabled'])
    },

    delete: (id) => {
        return knex('clerks').where({id}).del();
    },

    change_status: (id, enabled) => {
        return knex('clerks').where({id}).update({enabled}).returning(['id', 'name', 'pin', 'enabled']);
    }
}

module.exports = Clerks;