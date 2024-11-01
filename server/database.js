// setup & config db connection handling library - knex
const knex = require('knex');
const config = require('./knexfile');
const connection = knex(config['dev']);

module.exports = connection;