'use strict';
var path = require('path');
var bodyParser = require('body-parser');
const routes = require('./routes');
var express = require('express')
    , app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization,content-type,Access-Control-Allow-Origin");
    next();
});


const config = require('./config.js').get(process.env.NODE_ENV);




require('./routes')(app);

app.listen(3000, function() {
    console.log(config.database);
    console.log('Listening on port 3000')
})