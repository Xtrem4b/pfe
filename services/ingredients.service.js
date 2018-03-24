'use strict'

const MongoClient = require('mongodb').MongoClient;
const config = require('../config.js').get(process.env.NODE_ENV);
const database = require('../services/db.service')
const ObjectID = require('mongodb').ObjectID; 
const csv = require("fast-csv");

var ingredients = {
    getBySynonyme: function(names,callback){
        database.connect((db,dbo) => {
            dbo.collection("ingredients").find( {synonyme: {$in : names } }).toArray(function(err, ingredients){
                if (err) throw err;
                db.close();
                callback(ingredients);
            })
        })
    },
    
    reset: function(callback){
        database.connect((db,dbo) => {
            dbo.collection("ingredients").drop(function(err, ok){
                if (err) throw err;
                if (ok) callback("Collection ingredients deleted");
            }); 
        })
    },
    
    //TODO: Abstract this method, use template
    getFromSwissCSV: function(){
        return new Promise((resolve,reject) => {
            var dataArray = [];
            csv.fromPath("./services/swiss.csv", {headers: true})
            .on("data", data => {
               let ingredient = {
                    "name" : data["name F"],
                    "synonyme" : [],
                    "category" : data["category F"],
                    "energy_kj" : data["energy kJ"],
                    "energy_kcal" : data["energy kcal"],
                    "protein" : data["protein"],
                    "sugar" : data["sugars"],
                    "fat" : data["fat, total"],
                    "cholesterol" : data["cholesterol"],
                    "sodium" : data["sodium (Na)"]
                }
               dataArr.push(ingredient);
            })
            .on("end", () => {
                resolve(dataArray);
            });
         })
    },
    
    addIngredients: function(data){
        return new Promise(function(resolve, reject) {
            database.connect((db,dbo) => {
                dbo.collection("ingredients").insertMany(data, function(err, res){
                        if (err) throw err;
                        db.close();
                        resolve(res.insertedCount+" ingredients inserted");
                    });
            });
        })
    },
    
    create: function(callback){
        database.connect((db,dbo) => {
            dbo.createCollection("ingredients", function(err, res) {
                if (err) throw err;
                ingredients.getFromSwissCSV().then(data => ingredients.addIngredients(data)
                                        .then(log => callback(log))
                                        .catch(err => console.log(err)))
                     .catch(err => console.log(err));
            });
        })
    }

}

module.exports = ingredients;