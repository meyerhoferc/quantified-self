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

  describe('GET api/v1/meals/:id', function() {
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

    it('should return a 200 status code', function(done) {
      this.request.get('/api/v1/meals/1', function(error, response){
        if(error){ done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should return a 404 status code if not found', function(done) {
      this.request.get('/api/v1/meals/111', function(error, response){
        if(error){ done(error); }
        assert.equal(response.statusCode, 404);
        done();
      });
    });

    it('should return a meal with the equivalent id', function(done) {
      this.request.get('/api/v1/meals/1', function(error, response){
        if(error){ done(error); }
        const meal = JSON.parse(response.body);
        assert.equal(meal.name, "Breakfast");
        assert.equal(meal.total_calories, 100);
        done();
      });
    });
  });

  describe('POST api/v1/meals', function() {
    it('should create a meal in the database', function(done) {
      this.timeout(100000);

      this.request.post({
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        url: '/api/v1/meals?name=breakfast&total_calories=500&daily_log=' + new Date}, (error, response) => {
          if (error) { done(error) };
          const newMeal = JSON.parse(response.body);
          assert.equal(newMeal.name, "breakfast");
          assert.equal(newMeal.total_calories, 500);
          done()
      });
    });
  });
});
