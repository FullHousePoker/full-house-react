var path = require('path');
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, '../client')));

app.listen(8080, function() {
  console.log('listening at http://localhost:8080');
});