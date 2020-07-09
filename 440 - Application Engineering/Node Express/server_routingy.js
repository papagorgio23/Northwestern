const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
});



app.get('/user', function (req, res) {
  res.send('Got a GET request at /user')
})


app.listen(3000);
