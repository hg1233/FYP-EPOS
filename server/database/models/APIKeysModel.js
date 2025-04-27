const knex = require('../../database.js')

const APIKeys = {

    isKeyValid: (api_key) => {
        return knex('api_keys').where({api_key}).first();
    },

    updateLastHeartbeat: (api_key, last_heartbeat) => {
        return knex('api_keys').where({api_key}).update({last_heartbeat}).returning(['api_key', 'name', 'enabled', 'last_heartbeat']);
    },

    create: (api_key, name) => {
        return knex('api_keys')
        .insert({api_key, name})
        .returning(['api_key', 'name', 'enabled', 'last_heartbeat'])
    },

    setStatus: (api_key, enabled) => {
        return knex('api_keys').where({api_key}).update({enabled}).returning(['api_key', 'name', 'enabled', 'last_heartbeat']);
    }



}

module.exports = APIKeys;