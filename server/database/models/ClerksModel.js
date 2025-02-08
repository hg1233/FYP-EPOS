const knex = require('../../database.js')

const Clerks = {
    create: (name, pin) => {
        return knex('clerks')
        .insert({name, pin})
        .returning(['id', 'name', 'pin', 'is_manager'])
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
        return knex('clerks').where({id}).update({name, pin}).returning(['id', 'name', 'pin', 'enabled', 'is_manager'])
    },

    delete: (id) => {
        return knex('clerks').where({id}).del();
    },

    change_status: (id, enabled) => {
        return knex('clerks').where({id}).update({enabled}).returning(['id', 'name', 'pin', 'enabled', 'is_manager']);
    },

    change_role: (id, is_manager) => {
        return knex('clerks').where({id}).update({is_manager}).returning(['id', 'name', 'pin', 'enabled', 'is_manager']);
    }
}

module.exports = Clerks;