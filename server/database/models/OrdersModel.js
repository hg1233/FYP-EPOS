const knex = require('../../database.js')

const Orders = {

    create: (clerk_id, table_id, order_name) => {
        return knex('orders')
        .insert({clerk_id, table_id, order_name})
        .returning('id', 'order_name', 'table_id', 'created_at', 'created_by', 'is_open', 'is_paid', 'payment_method')
    },

    getAllOrders: () => {
        return knex('orders').select('*');
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
        );
    }

}

module.exports = Orders;
