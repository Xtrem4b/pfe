
const database = require('../services/db.service')
const ObjectID = require('mongodb').ObjectID; 
const request = require('request');

var userService = {
    
    register : function(user,callback) {
        let options = {}
        options.query = {email: user.email}
        database.findOne("users",options,(isIn) =>{
            if (isIn){
                callback()
            }else{
                let data = {
                        email: user.email,
                        password: user.password,
                        pseudo: user.login,
                        information: null,
                        lunch: []
                        }
                database.insert("users",data,(msg) => callback(msg))
            }
        })
    },
      
    updateProfil : function(user,callback){
        let values = {$set:{information: {sexe: user.sexe, age: user.age, taille : user.taille, poids : user.poids, tabac: user.tabac, activite : user.activite, alimentation: user.alimentation }}};
        
        database.update("users",user.id,values,(msg) => callback(msg))
    },
    
    login: function(email,password,callback) {
        let options = {}
        options.query = {email: email, password: password}
        database.findOne("users",options,(data) => {
            if (data){
                let user = {id : data._id ,email : data.email, pseudo : data.pseudo, information : data.information};
                callback(user)
            }else{
                callback()
            }
        })
    },
    
    getInfo: function(id,callback){
        database.getById("users",id,function(data){
            (data.information) ? callback(data.information) : callback({})
        })
    },
    
    getLunch: function(id,days,callback) {
        database.getLunchByDays(id,days,function(user){
            callback(user)
        })
    },
    
    addEatenRecipe: function(id,recipeID,lunchType,callback){
        database.getById("recipes",recipeID,function(data){
            let recipe = {id:data._id,title:data.title,ingredient:data.ingredients}
            let values = {lunch : {recipe: recipe, lunchType: lunchType, createdAt: new Date()}};
            database.update("users",id,values, function(result){
                callback(result)
            })
        })   
    },
    
    addProcessedFood: function(id,food,lunchType,callback){
        let values = {$push:{lunch : {processedFood: food, lunchType: lunchType, createdAt: new Date() }}} ;
         database.update("users",id,values, function(result){
            callback(result)
        })
    },
    
    getFoodFromCode: function(code,callback){
        request.get({url:"https://fr.openfoodfacts.org/api/v0/produit/"+code, json:true},function(e,r,product){
             if (product.status != 0) {
                 let productInfo = {
                        "name": product.product.product_name,
                        "ingredients" : product.product.ingredients_text_debug,
                        "image" : product.product.image_front_thumb_url,
                        "quantity" : product.product.quantity,
                        "nutriments" : {
                            calories: product.product.nutriments.energy_value,
                            proteins:product.product.nutriments.proteins,
                            lipide:product.product.nutriments.fat,
                            glucide:product.product.nutriments.carbohydrates,
                            sel:product.product.nutriments.salt
                        }
                };
                callback(productInfo)
            }else{
                callback()
            }
        })
    }     
    
}

module.exports = userService;