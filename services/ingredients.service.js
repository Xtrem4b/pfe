'use strict'

const MongoClient = require('mongodb').MongoClient;
const config = require('../config.js').get(process.env.NODE_ENV);
const database = require('../services/db.service')
const ObjectID = require('mongodb').ObjectID; 

var ingredients = {
    getBySynonyme: function(names,callback){
        database.connect((db,dbo) => {
            dbo.collection("ingredients").find( {synonyme: {$in : names } }).toArray(function(err, ingredients){
                if (err) throw err;
                db.close();
                callback(ingredients);
            })
        })
    }
}

module.exports = ingredients;