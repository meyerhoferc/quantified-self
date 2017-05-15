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
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Banana', 50, new Date])
      .then(() => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Donut', 500, new Date])
      .then(() => done())})
      // database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Lettuce', 10, new Date])
      // database.raw('INSERT INTO meals (name, total_calories, date, created_at) VALUES(?, ?, ?)', ['Breakfast', 100, new Date, new Date])
      // database.raw('INSERT INTO meals (name, total_calories, date, created_at) VALUES(?, ?, ?)', ['Lunch', 20, new Date, new Date])
      // database.raw('INSERT INTO meals-foods (food_id, meal_id) VALUES(?, ?, ?)', [1, 1])
      // database.raw('INSERT INTO meals-foods (food_id, meal_id) VALUES(?, ?, ?)', [1, 1])
      // database.raw('INSERT INTO meals-foods (food_id, meal_id) VALUES(?, ?, ?)', [2, 2])
      // database.raw('INSERT INTO meals-foods (food_id, meal_id) VALUES(?, ?, ?)', [2, 2])
    });

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      database.raw('TRUNCATE meals-foods RESTART IDENTITY')
      database.raw('TRUNCATE meals RESTART IDENTITY')
      .then(() => done())
    })

    it('should return a 404 if meal not found', function(done){
      this.request.get('/api/meals/10', function(error, response){
        if(error){ done(error); }
        assert.equal(response.statusCode, 404);
        done();
      });
    });
    it('should return a 200 status code if food is found', function(done){
      this.request.get('/api/meals/1', function(error, response){
        if(error){ done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
    it('should return the name, total calories, and date for the meal', function(done){
      this.request.get('/api/meals/1', function(error, response){
        if(error){ done(error); }
        const meal = JSON.parse(response.body).meal
        assert.equal(meal.name, "Breakfast");
        assert.equal(meal.total_calories, 100);
        done();
      });
    });
  });
});
