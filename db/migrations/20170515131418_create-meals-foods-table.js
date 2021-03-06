exports.up = function(knex, Promise) {
  return knex.schema.createTable('meals-foods', function(table){
    table.increments();
    table.integer('food_id').notNullable();
    table.integer('meal_id').notNullable();
    table.timestamps('created_at');
  });
};

exports.down = function(knex, Promise) {
  let dropMealsFoodsTable = `DROP TABLE meals-foods`;
  return knex.raw(dropMealsFoodsTable);
};
