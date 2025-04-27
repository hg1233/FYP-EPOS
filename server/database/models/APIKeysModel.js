const knex = require('../../database.js')

const APIKeys = {

    isKeyValid: (api_key) => {
        return knex('api_keys').where({api_key}).first();
    },

    updateLastHeartbeat: (api_key, last_heartbeat) => {

    },

    create: (api_key, name) => {

    },

    setStatus: (api_key, enabled) => {

    }



}

module.exports = APIKeys;