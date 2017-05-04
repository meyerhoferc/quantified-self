const assert = require('chai').assert;
const app = require('../server');
const request = require('request');


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
  });
});
