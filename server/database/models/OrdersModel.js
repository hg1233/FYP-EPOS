const knex = require('../../database.js')

const Orders = {

    create: (created_by, table_id, order_name) => {

        return knex('orders')
        .insert({created_by, table_id, order_name})
        .returning('*')
    },

    getAllOrders: () => {
        return knex('orders').select('*');
    },

    getAllOrdersWithSuborders: () => {
        return knex('orders').select('orders.*', knex.raw('GROUP_CONCAT(suborder.suborder_id) as suborders'))
        .leftJoin('suborder', 'orders.id', 'suborder.order_id')
        .groupBy('orders.id')
        .then((response) => {

            response.forEach(entry => {
                // sql outputs just as a concatenated string, parse/convert to list
                if(typeof entry.suborders == "string") {
                    Object.assign(entry, {suborders: entry.suborders.split(',')})

                }
            })

            return response;

        })
    },

    getOrderByIDWithSuborders: (id) => {
        return knex('orders').select('orders.*', knex.raw('GROUP_CONCAT(suborder.suborder_id) as suborders'))
        .leftJoin('suborder', 'orders.id', 'suborder.order_id')
        .where({id})
        .groupBy('orders.id')
        .first()
        .then((response) => {

            // sql outputs just as a concatenated string, parse/convert to list
            if(typeof response.suborders == "string") {
                Object.assign(response, {suborders: response.suborders.split(',')})

            }

        return response;

        })
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
