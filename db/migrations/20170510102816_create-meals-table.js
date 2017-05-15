
exports.up = function(knex, Promise) {
  return knex.schema.createTable('meals', function(table){
    table.increments();
    table.string('name').notNullable();
    table.integer('total_calories').notNullable();
    table.date('daily_log').notNullable();
    table.timestamps('created_at');
  });
};

exports.down = function(knex, Promise) {
  let dropMealsTable = `DROP TABLE meals`;
  return knex.raw(dropMealsTable)
};
