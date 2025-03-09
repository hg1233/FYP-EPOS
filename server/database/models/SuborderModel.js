const knex = require('../../database.js')

const Suborder = {

    create: () => {
        // TODO
        return null;
    },

    getAll: () => {
        return knex('suborder').select('*');
    },

    getSubordersByConfirmedStatus: (suborder_confirmed) => {
        return knex('suborder').select('*').where({suborder_confirmed});
    },

    getSuborderBySuborderID: (suborder_id) => {
        return knex('suborder').select('*').where({suborder_id}).first();
    },

    getSubordersByOrderID: (order_id) => {
        return knex('suborder').select('*').where({order_id});
    },

    getSubordersByClerk: (created_by) => {
        return knex('suborder').select('*').where({created_by});
    },

}

module.exports = Suborder;