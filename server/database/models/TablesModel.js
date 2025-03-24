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

    getAllWithOrders(open) {
        return knex('tables').select('tables.*', knex.raw('GROUP_CONCAT(orders.id) as orders'))
        .leftJoin('orders', function() {
            this.on('tables.id', 'orders.table_id')
            .andOnVal('orders.is_open', open)
        })
        .groupBy('tables.id');
    },

    getByID: (id) => {
        return knex('tables').where({id}).first()
    },

    getByDisplayName: (display_name) => {
        return knex('tables').where({display_name}).first()
    },

    change_status: (id, enabled) => {
        return knex('tables').where({id}).update({enabled}).returning(['id', 'display_name', 'seats', 'enabled']);
    },

    update: (id, display_name, seats) => {
        return knex('tables').where({id}).update({display_name, seats}).returning(['id', 'display_name', 'seats', 'enabled']);
    },

}

module.exports = Tables;