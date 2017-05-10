const express = require('express')
const app = express()
const FoodsController = require('./lib/controllers/foods-controller')


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

if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log("App is running!");
  })
}

module.exports = app;
