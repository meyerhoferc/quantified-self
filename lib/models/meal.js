const environment    = process.env.NODE_ENV || 'development'
const configuration  = require('../../knexfile')[environment]
const database  = require('knex')(configuration)

function all () {
  return database.raw('SELECT * FROM meals')
}

function find (id) {
  return database.raw('SELECT * FROM meals WHERE id = ? LIMIT 1', [id])
}

module.exports = {
  all: all,
  find: find
}
