const knex = require('../../database.js')

const PaymentMethods = {

    getAll: () => {
        return knex('payment_methods').select('*');
    },

    getByID: (id) => {
        return knex('payment_methods').select('*').where({id});
    },

    getByMethodName: (method) => {
        return knex('payment_methods').select('*').where({method});
    },

    create: (method) => {
        return knex('payment_methods').insert({method}).returning('*');
    }

}

module.exports = PaymentMethods;