const assert = require('chai').assert;
const app = require('../server');
const request = require('request');
const pry = require('pryjs')

describe('Server', function() {
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

  it('should exist', function() {
    assert(app);
  });

  describe('GET api/foods/:id', function(){
    beforeEach(function(){
      app.locals.secrets = {
        1: {name: 'banana', calories: 50}
      }
    });
    it('should return a 404 if food not found', function(done){
      this.request.get('/api/foods/2', function(error, response){
        if(error){ done(error); }
        assert.equal(response.statusCode, 404);
        done();
      });
    });
    it('should return a 200 status code if food is found', function(done){
      this.request.get('/api/foods/1', function(error, response){
        if(error){ done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
    it('should return a food object if food is found', function(done){
      this.request.get('/api/foods/1', function(error, response){
        if(error){ done(error); }
        assert.deepEqual(JSON.parse(response.body).food, {"name":"banana", "calories":50});
        done();
      });
    });
  });
});
