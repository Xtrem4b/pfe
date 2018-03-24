'use strict'

const MongoClient = require('mongodb').MongoClient;
const config = require('../config.js').get(process.env.NODE_ENV);
const ObjectID = require('mongodb').ObjectID; 

var Ingredient = require('../models/ingredient')

var database = require('../services/db.service')
var ingredient_service = require('../services/ingredients.service')
//var ingredientsService = require('../services')

var ingredients = {

    categories: function(req, res){
        database.getDistinct("ingredients","category",(data) => res.send(data))
    },
    
    category: function(req, res){   
        let options = (req.query.category) ? {query:{"category":req.query.category}} : {};
        database.getAll("ingredients",options,(data) => res.send(data))
    },
    
    ingredientById: function(req, res){
        database.getById("ingredients",req.params.id,(data) => res.send(new Ingredient(data).data))
    },
    
    updateSynonyme: function(req, res){
        let values = {$push : {synonyme : req.body.ingredient.replace(/^ +/gm, '') }};
        database.update("ingredients",req.body.id,values,(data) => res.send(result))
    },
    
    reset: function(req,res){
        ingredient_service.reset((msg) => {res.send(msg)})
    },
    
    create: function(req,res){
        ingredient_service.create((msg) => {res.send(msg)})
    }
    
}

module.exports = ingredients;