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
    }

}

module.exports = Orders;
