
const database = require('../services/db.service')
const ObjectID = require('mongodb').ObjectID; 
const request = require('request');

var userService = {
    
    register : function(user,callback) {
        database.connect( (db,dbo) => {
            dbo.collection("users").findOne({email:user.email},function (err,u){
                if (u) {
                    callback()
                }else{
                    dbo.collection("users").insert({
                        email: user.email,
                        password: user.password,
                        pseudo: user.login,
                        information: null,
                        lunch: []
                    },function(err,res){
                        if (err){
                            throw err;
                        }
                        else {
                            callback(res);
                        }
                    })
                }
            })
        })
    },
    
    
    updateProfil : function(user,callback){
        console.log(user)
        database.connect( (db,dbo) => {
            let newvalues = {$set: {information: {sexe: user.sexe, age: user.age, taille : user.taille, poid : user.poid, tabac: user.tabac, activite : user.activite, alimentation: user.alimentation}
            }}
            dbo.collection("users").update({ _id: ObjectID(user.id) },newvalues,function(err,res){
                if (err) throw err;
                callback(res)
            })
        })
    },
    
    login: function(email,password,callback) {
        database.connect( (db,dbo) => {
            dbo.collection("users").findOne({email: email, password: password}, function (err, user){
                if (err){
                    throw err;
                }
                if (user){
                    callback(user)
                }else{
                    callback()
                }
            })
        })
    },
    
    getInfo: function(id,callback){
        database.getById("users",id,function(data){
            callback(data.information)
        })
    },
    
    getLunch: function(id,callback) {
        database.getById("users",id,function(user){
            if (user){
                 callback(user.lunch)
            }
        })
    },
    
    addEatenRecipe: function(id,recipeID,lunchType,callback){
        database.getById("recipes",recipeID,function(data){
            let recipe = {id:data._id,title:data.title,ingredient:data.ingredients}
            let values = {$push : {lunch : {recipe: recipe, lunchType: lunchType}} };
            database.update("users",{ _id: ObjectID(id)} ,values, function(result){
                if (result){
                    callback(result)
                }
            })
        })   
    },
    
    addProcessedFood: function(id,food,lunchType,callback){
        let values ={$push : {lunch : {processedFood: food, lunchType: lunchType }} };
         database.update("users",{ _id: ObjectID(id)},values, function(result){
             if (result){
                 callback(result)
            }else{
                callback()
            }
        })
    },
    
    getFoodFromCode: function(code,callback){
        request.get({url:"https://fr.openfoodfacts.org/api/v0/produit/"+code, json:true},function(e,r,product){
             let productInfo = {
                    "ingredients" : product.product.ingredients_text_debug,
                    "image" : product.product.image_front_thumb_url,
                    "quantity" : product.product.quantity,
                    "nutriments" : {
                        calories: product.product.nutriments.energy_value,
                        proteins:product.product.nutriments.proteins,
                        fat:product.product.nutriments.fat,
                        glucide:product.product.nutriments.carbohydrates,
                        sucre: product.product.nutriments.sugars_value,
                        sel:product.product.nutriments.salt
                    }
            };
            return callback(productInfo);
        })
    }
    
    
    
    
    
    
                        
}

module.exports = userService;