exports.seed = function(knex, Promise) {
  return knex.raw(`TRUNCATE foods RESTART IDENTITY`).then(() => {
    return Promise.all([
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Tofu', 50, new Date]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Sweet Potato', 200, new Date]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Garlic', 2, new Date]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Avocado', 100, new Date]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Kale', 20, new Date]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Wild Rice', 150, new Date]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Olive Oil', 120, new Date]),
      knex.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Red Lentils', 220, new Date])
    ]);
  });
};
