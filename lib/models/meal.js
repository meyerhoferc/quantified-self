const environment    = process.env.NODE_ENV || 'development'
const configuration  = require('../../knexfile')[environment]
const database  = require('knex')(configuration)
const pry = require('pryjs')

function all () {
  return database.raw('SELECT * FROM meals');
};

function find (id) {
  return database.raw('SELECT * FROM meals WHERE id = ? LIMIT 1', [id]);
};

function create (name, totalCalories, dailyLog) {
  const mealDate = new Date(dailyLog.valueOf());
  return database('meals').returning(['id', 'name','total_calories', 'daily_log']).insert({name: name, total_calories: totalCalories, daily_log: mealDate, created_at: new Date})
  .catch(function(error) {
    return [];
  });
};

function destroy (id) {
  return database('meals').where('id', id).del()
  .catch(function(error) {
    return 0
  });
};

module.exports = {
  all: all,
  find: find,
  create: create,
  destroy: destroy
};
