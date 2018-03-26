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
               dataArray.push(ingredient);
            })
            .on("end", () => {
                resolve(dataArray);
            });
         })
    },

    getFromCSV: function(csvName){
        return new Promise((resolve,reject) => {
            let schema = require('../models/csv-schemas/'+csvName+'.csv').schema
            var dataArray = [];
            csv.fromPath("./services/csv/"+csvName+".csv", {headers: true})
            .on("data", data => {
               let ingredient = {
                    "name" : data[schema.name],
                    "synonyme" : [],
                    "category" : data[schema.category],
                    "energy_kcal" : data[schema.energy_kcal],
                    "protein" : data[schema.protein],
                    "sugar" : data[schema.sugar],
                    "fat" : data[schema.fat],
                    "sodium" : data[schema.sodium]
                }
               dataArray.push(ingredient);
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
                ingredients.getFromCSV("ciqual").then(data => ingredients.addIngredients(data)
                                        .then(log => callback(log))
                                        .catch(err => console.log(err)))
                     .catch(err => console.log(err));
            });
        })
    }

}

module.exports = ingredients;