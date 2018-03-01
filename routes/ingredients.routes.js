'use strict'

const MongoClient = require('mongodb').MongoClient;
const config = require('../config.js').get(process.env.NODE_ENV);
const ObjectID = require('mongodb').ObjectID; 

var Ingredient = require('../models/ingredient')

var database = require('../services/db.service')

var ingredients = {

    categories: function(req, res){
        database.connect( (db,dbo) => {
           dbo.collection("ingredients").distinct("category", function(err, data) {
                if (err) throw err;
                db.close();
                return(res.send(data));
            });
        });
    },
    
    category: function(req, res){
        database.connect( (db,dbo) => {
           dbo.collection("ingredients").find({"category": req.query.category}).toArray(function(err, data) {
                if (err) throw err;
                db.close();
                return(res.send(data.map(ingredient => new Ingredient(ingredient))));
            });
        });
    },
    
    ingredientById: function(req, res){
        database.connect( (db,dbo) => {
           dbo.collection("ingredients").findOne({"_id": ObjectID(req.params.id)},function(err, data) {
                if (err) throw err;
                db.close();
                return(res.send(new Ingredient(data)));
            });
        });
    },
    
    updateSynonyme: function(req, res){
        database.connect( (db,dbo) => {
            let values = {$push : {synonyme : req.body.ingredient }};
            let id = { _id : ObjectID(req.body.id)}
            dbo.collection("ingredients").update( id, values,function(err, result){
               if (err) throw err;
                return(res.send(result));
                db.close();
            });
        });
    }
    
}

module.exports = ingredients;