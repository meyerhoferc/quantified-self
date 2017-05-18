const express = require('express')
const app = express()
const FoodsController = require('./lib/controllers/foods-controller')
const MealsController = require('./lib/controllers/meals-controller')
const cors = require('cors');

app.use(cors({origin: '*'}));

app.set('port', process.env.PORT || 3000);
app.locals.title = "Quantified Self"

app.get('/', function(request, response) {
  response.send('The front page works.')
})

app.get('/api/foods/:id', FoodsController.show);
app.get('/api/foods/', FoodsController.index);
app.post('/api/foods/', FoodsController.create);
app.delete('/api/foods/:id', FoodsController.destroy);
app.put('/api/foods/:id', FoodsController.update);
app.get('/api/search/foods', FoodsController.search);

app.get('/api/v1/meals/:id', MealsController.show);
app.get('/api/v1/meals/', MealsController.index);
app.post('/api/v1/meals/', MealsController.create);
app.delete('/api/v1/meals/:id', MealsController.destroy);

if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log("App is running!");
  })
}

module.exports = app;
