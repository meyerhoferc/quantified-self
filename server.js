const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = "Quantified Self";

app.get('/', function(request, response) {
  response.send('The front page works.');
});

app.listen(app.get('port'), function() {
  console.log("App is running!");
});
