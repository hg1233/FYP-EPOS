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
        .returning('*');
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

    setSuborderLineComments: (line_id, line_comments) => {
        return knex('suborder_line')
        .where({line_id})
        .update({line_comments})
        .returning('*');
    },

    updateLineQuantity: (line_id, product_unit_price, product_qty, subtotal) => {
        return knex('suborder_line')
        .where({line_id})
        .update({product_unit_price, product_qty, subtotal})
        .returning('*');
    },

    void: (line_id) => {
        return knex('suborder_line').where({line_id}).del();
    }

}

module.exports = SuborderLine;