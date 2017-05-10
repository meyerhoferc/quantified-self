
exports.up = function(knex, Promise) {
    return knex.schema.createTable('foods', function(table){
      table.increments();
      table.string('name').notNullable().unique();
      table.integer('calories').notNullable();
      table.timestamps('created_at');
  });
};

exports.down = function(knex, Promise) {
  let dropFoodsTable = `DROP TABLE foods`;
  return knex.raw(dropFoodsTable);
};
