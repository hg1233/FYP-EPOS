const knex = require('../../database.js')

const SuborderLine = {

    create: () => {
        // TODO
        return null;
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