const MongoClient = require('mongodb').MongoClient;
const config = require('../config.js').get(process.env.NODE_ENV);
const database = config.database;
const ObjectID = require('mongodb').ObjectID; 

var recipes_service = {
    
}