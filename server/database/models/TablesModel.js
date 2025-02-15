const knex = require('../../database.js')

const Tables = {

    create: (display_name, seats) => {
        return knex('tables')
        .insert({display_name, seats})
        .returning(['id', 'display_name', 'seats', 'enabled'])
    },

    getAll: () => {
        return knex('tables').select('*');
    },

    getByID: (id) => {
        return knex('tables').where({id}).first()
    },

    getByDisplayName: (display_name) => {
        return knex('tables').where({display_name}).first()
    },

    

}

module.exports = Tables;