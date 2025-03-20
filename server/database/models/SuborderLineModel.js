const knex = require('../../database.js')

const SuborderLine = {

    create: (suborder_id, product_id, product_name, product_unit_price, product_qty, subtotal, line_comments) => {
        return knex('suborder_line')
        .insert(
            {
                suborder_id, 
                product_id,
                product_name,
                product_unit_price,
                product_qty,
                subtotal,
                line_comments,
            }
        )
        .returning(['*'])
    },

    getAll: () => {
        return knex('suborder_line').select('*');
    },

    getByLineID: (line_id) => {
        return knex('suborder_line').select('*').where({line_id}).first();
    },

    getLinesBySuborderID: (suborder_id) => {
        return knex('suborder_line').select('*').where({suborder_id});
    },

}

module.exports = SuborderLine;