const knex = require('../../database.js')

const Suborder = {

    create: (order_id, created_by) => {
        return knex('suborder')
        .insert({order_id, created_by})
        .returning(['*']);
    },

    getAll: () => {
        return knex('suborder').select('*');
    },

    getSubordersByConfirmedStatus: (suborder_confirmed) => {
        return knex('suborder').select('*').where({suborder_confirmed});
    },

    getSuborderBySuborderID: (suborder_id) => {
        return knex('suborder').select('*').where({suborder_id});
    },

    getSubordersByOrderID: (order_id) => {
        return knex('suborder').select('*').where({order_id});
    },

    getSubordersByClerk: (created_by) => {
        return knex('suborder').select('*').where({created_by});
    },

    confirmSuborder: (suborder_id) => {
        return knex('suborder')
        .where({suborder_id})
        .update({suborder_confirmed: true})
        .returning('*');
    },

}

module.exports = Suborder;