const environment    = process.env.NODE_ENV || 'development'
const configuration  = require('../../knexfile')[environment]
const database  = require('knex')(configuration)

function all () {
  return database.raw('SELECT * FROM meals')
}

module.exports = {
  all: all
}
