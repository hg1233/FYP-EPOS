const knex = require('../../database.js')

const Orders = {

    create: (created_by, table_id, order_name) => {

        // TODO - implement null check for `table_id` & `order_name` if undefined, as the below may cause issues, testing required

        return knex('orders')
        .insert({created_by, table_id, order_name})
        .returning('*')
    },

    getAllOrders: () => {
        return knex('orders').select('*');
    },

    getOrdersByOrderStatus: (is_open) => {
        return knex('orders').select('*').where({is_open});
    },

    getOrderByID: (id) => {
        return knex('orders').select('*').where({id}).first();
    },

    getOrdersByTableID: (table_id) => {
        return knex('orders').where({table_id});
    },

    markAsPaidAndCloseOrder: (id, is_paid, payment_method) => {
        return knex('orders').where({id}).update(
            {
                is_paid: is_paid,
                payment_method: payment_method,
                is_open: false,
            }
        ).returning('*');
    },

    setTable: (id, table_id) => {
        return knex('orders').where({id}).update({table_id: table_id}).returning('*');
    }

}

module.exports = Orders;
