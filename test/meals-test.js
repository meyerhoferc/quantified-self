const assert = require('chai').assert;
const app = require('../server');
const request = require('request');
const pry = require('pryjs')
const environment    = process.env.NODE_ENV || 'test'
const configuration  = require('../knexfile')[environment]
const database  = require('knex')(configuration)

describe('Meals Endpoints', function() {
  before(function(done){
    this.port = 9876;
    this.server = app.listen(this.port, function(err, result) {
      if (err) { return done(err); }
      done();
    });
    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(function() {
    this.server.close();
  });

  describe('GET api/v1/meals', function(){
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Doner', 500, new Date])
      .then(() => {
        database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Lettuce', 10, new Date])
        .then(() => {
          database.raw('INSERT INTO meals (name, total_calories, daily_log, created_at) VALUES(?,?,?,?)', ['Breakfast', 100, new Date, new Date])
          .then(() => {
            database.raw('INSERT INTO meals (name, total_calories, daily_log, created_at) VALUES(?,?,?,?)', ['Lunch', 20, new Date, new Date])
            .then(() => {
              database.raw('INSERT INTO meals_foods (food_id, meal_id, created_at) VALUES(?,?,?)', [1, 1, new Date])
              .then(() => {
                database.raw('INSERT INTO meals_foods (food_id, meal_id, created_at) VALUES(?,?,?)', [1, 1, new Date])
                .then(() => {
                  database.raw('INSERT INTO meals_foods (food_id, meal_id, created_at) VALUES(?,?,?)', [2, 2, new Date])
                  .then(() => {
                    database.raw('INSERT INTO meals_foods (food_id, meal_id, created_at) VALUES(?,?,?)', [2, 2, new Date])
                    .then(() => done())
                  }).catch(done)
                });
              });
            });
          });
        });
      });
    });

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => {
        database.raw('TRUNCATE meals_foods RESTART IDENTITY')
        .then(() => {
          database.raw('TRUNCATE meals RESTART IDENTITY')
          .then(() => done());
        });
      });
    });

    it('should return a 200 status code', function(done){
      this.request.get('/api/v1/meals/', function(error, response){
        if(error){ done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should return a collection of meals', function(done){
      this.timeout(100000);
      this.request.get('/api/v1/meals/', function(error, response){
        if(error){ done(error); }
        const meals = JSON.parse(response.body);
        const breakfast = meals[0];
        const lunch = meals[1];
        assert.equal(breakfast.name, "Breakfast");
        assert.equal(lunch.name, "Lunch");
        assert.equal(breakfast.total_calories, 100);
        assert.equal(lunch.total_calories, 20);
        done();
      });
    });
  });
});
