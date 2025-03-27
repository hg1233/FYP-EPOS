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
        return knex('orders').select('orders.*', knex.raw('GROUP_CONCAT(suborder.suborder_id) as suborders'), knex.raw('SUM(suborder_line.subtotal) as total'))
        .leftJoin('suborder', 'orders.id', 'suborder.order_id')
        .leftJoin('suborder_line', 'suborder.suborder_id', 'suborder_line.suborder_id')
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

    getOrderByID: (id) => {
        return knex('orders').select('*').where('orders.id', id).first();
    },

    getOrderByIDWithSuborders: (id) => {

        let result = null;

        return knex('orders').select('orders.*', knex.raw('GROUP_CONCAT(suborder.suborder_id) as suborders'), knex.raw('SUM(suborder_line.subtotal) as total'))
        .leftJoin('suborder', 'orders.id', 'suborder.order_id')
        .leftJoin('suborder_line', 'suborder.suborder_id', 'suborder_line.suborder_id')
        .where({id})
        .groupBy('orders.id')
        .first()
        .then((response) => {

            // sql outputs just as a concatenated string, parse/convert to list
            if(typeof response.suborders == "string") {
                Object.assign(response, {suborders: response.suborders.split(',')})

            }

            // save query output
            result = response;

            // get all suborder data
            return knex('suborder').select('*').where('order_id', response.id)

        }).then((response) => {
            
            result.suborders = response;
            return result;
            
        })
    },

    getOrdersByOrderStatus: (is_open) => {
        return knex('orders').select('*').where({is_open});
    },

    getOrdersByOrderStatusWithSuborders: (is_open) => {
        return knex('orders').select('orders.*', knex.raw('GROUP_CONCAT(suborder.suborder_id) as suborders'), knex.raw('SUM(suborder_line.subtotal) as total'))
        .leftJoin('suborder', 'orders.id', 'suborder.order_id')
        .leftJoin('suborder_line', 'suborder.suborder_id', 'suborder_line.suborder_id')
        .groupBy('orders.id')
        .where({is_open})
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

    getOrdersByTableID: (table_id) => {
        return knex('orders').where({table_id});
    },

    getOrdersByTableIDWithSuborders: (table_id) => {
        return knex('orders').select('orders.*', knex.raw('GROUP_CONCAT(suborder.suborder_id) as suborders'))
        .leftJoin('suborder', 'orders.id', 'suborder.order_id')
        .groupBy('orders.id')
        .where({table_id})
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
