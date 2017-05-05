const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = "Quantified Self";

app.get('/', function(request, response) {
  response.send('The front page works.');
});

app.get('/api/foods/:id', function(request, response){
  var id = request.params.id;
  var food = app.locals.secrets[id];
  if(!food){return response.sendStatus(404);}
  response.json({
    food: food
  });
});

if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log("App is running!");
  });
};

module.exports = app;
