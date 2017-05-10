const assert    = require('chai').assert
const app       = require('../server')
const request   = require('request')
const environment    = process.env.NODE_ENV || 'test'
const configuration  = require('../knexfile')[environment]
const database  = require('knex')(configuration)
const Food     = require('../lib/models/food')

const pry = require('pryjs')

describe('Food Endpoints', () => {
  before(done => {
    this.port   = 9876

    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err) }
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close()
  })

  describe('GET /api/foods/:id', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Banana', 50, new Date])
      .then(() => done())
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should return a 404 if the food is not found', (done) => {
      this.request.get('/api/foods/10000', (error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 404)

        done()
      })
    })

    it('should have the id,name, and calories of the food', (done) => {
      this.request.get('/api/foods/1', (error, response) => {
        if (error) { done(error) }

        const id = 1
        const name = 'Banana'
        const calories = 50

        let parsedFood = JSON.parse(response.body)

        assert.equal(parsedFood.id, id)
        assert.equal(parsedFood.name, name)
        assert.equal(parsedFood.calories, calories)
        assert.ok(parsedFood.created_at)
        done()
      })
    })
    it('should return a 200 status code if food found', (done) => {
      this.request.get('/api/foods/1', (error, response) => {
        if (error) { done(error) }

        let parsedFood = JSON.parse(response.body)
        assert.equal(response.statusCode, 200)
        done()
      })
    })
  })


  describe('GET /api/foods/', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Banana', 50, new Date])
      .then(() => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Donut', 500, new Date])
      .then(() => done())})
    })

    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should have the id,name, and calories of the foods', (done) => {
      this.request.get('/api/foods', (error, response) => {
        if (error) { done(error) }

        const id = 1
        const name = 'Banana'
        const calories = 50
        const idA = 2
        const nameA = 'Donut'
        const caloriesA = 500

        let parsedFoods = JSON.parse(response.body)

        const banana = parsedFoods[0]
        const donut = parsedFoods[1]

        assert.equal(banana.id, id)
        assert.equal(banana.name, name)
        assert.equal(banana.calories, calories)
        assert.ok(banana.created_at)
        assert.equal(donut.id, idA)
        assert.equal(donut.name, nameA)
        assert.equal(donut.calories, caloriesA)
        assert.ok(donut.created_at)
        done()
      })
    })
    it('should return a 200 status code if food found', (done) => {
      this.request.get('/api/foods/1', (error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 200)
        done()
      })
    })
  })

  describe('POST /api/foods/', () => {
    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should create a food in the database with the desired parameters', (done) => {
      this.request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: '/api/foods?name=banana&calories=50'},(error, response) => {
        if (error) { done(error) }
        let newFood = JSON.parse(response.body)

        const name = 'banana'
        const calories = 50
        const id = 1

        assert.equal(newFood.name, name)
        assert.equal(newFood.calories, calories)
        assert.equal(newFood.id, id)
        done()
      })
    })

    it('should return a 404 if food not created', (done) => {
      this.request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: '/api/foods?&calories=50'},(error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })

  describe('DELETE /api/foods/:id', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Donut', 500, new Date])
      .then(() => done())
    })
    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should remove the desired food from the database', (done) => {
      this.request.delete('/api/foods/1', (error, response) => {

        assert.equal(response.statusCode, 200)

        database('foods').countDistinct('name').then(function(total){
            assert.equal(total[0].count, 0)
        })

        done()
      })
    })

    it('should return a 404 if food does not exist', (done) => {
      this.request.delete('/api/foods/2000', (error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })

  describe('PUT /api/foods/:id', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['Donut', 500, new Date])
      .then(() => done())
    })
    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should update the food with the new parameters', (done) => {
      this.request.put({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: '/api/foods/1?name=banana&calories=50'}, (error, response) => {
        if (error) { done(error) }

        let updatedFood = JSON.parse(response.body)

        assert.equal(updatedFood.id, 1)
        assert.equal(updatedFood.name, 'banana')
        assert.equal(updatedFood.calories, 50 )

        done()
      })
    })
    it('should return a 404 if food does not exist', (done) => {
      this.request.put({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: '/api/foods/3?name=cronut&calories=50'}, (error, response) => {
        if (error) { done(error) }

        assert.equal(response.statusCode, 404)
        done()
      })
    })
  })

  describe('GET /api/search/foods', () => {
    beforeEach((done) => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['DonutA', 50, new Date])
      .then(() => {
      database.raw('INSERT INTO foods (name, calories, created_at) VALUES(?,?,?)', ['DonutB', 500, new Date])
      .then(() => done())})
    })
    afterEach((done) => {
      database.raw('TRUNCATE foods RESTART IDENTITY')
      .then(() => done())
    })

    it('should return foods which match the search parameter', (done) => {
      this.request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: '/api/search/foods?searchName=d'}, (error, response) => {
        if (error) { done(error) }

        let searchResults = JSON.parse(response.body)
        let foodA = searchResults[0]
        let foodB = searchResults[1]

        assert.equal(foodA.id, 1)
        assert.equal(foodA.name, 'DonutA')
        assert.equal(foodA.calories, 50 )
        assert.equal(foodB.id, 2)
        assert.equal(foodB.name, 'DonutB')
        assert.equal(foodB.calories, 500 )

        done()
      })
    })
    
    it('should return an empty array if no results found', (done) => {
      this.request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url: '/api/search/foods?name=banana'}, (error, response) => {
        if (error) { done(error) }

        let searchResults = JSON.parse(response.body)
        assert.typeOf(searchResults, 'array')
        assert.equal(searchResults.length, 0)
        done()
      })
    })
  })
})
