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
                    "proteine" : data[schema.protein],
                    "glucide" : data[schema.glucide],
                    "lipide" : data[schema.lipide],
                    "sel" : data[schema.sodium]
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
    
    create: function(csvName,callback){
        database.connect((db,dbo) => {
            dbo.createCollection("ingredients", function(err, res) {
                if (err) throw err;
                ingredients.getFromCSV(csvName).then(data => ingredients.addIngredients(data)
                                        .then(log => callback(log))
                                        .catch(err => console.log(err)))
                     .catch(err => console.log(err));
            });
        })
    }

}

module.exports = ingredients;