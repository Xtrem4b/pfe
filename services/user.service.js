
const database = require('../services/db.service')
const ObjectID = require('mongodb').ObjectID; 
const request = require('request');

var userService = {
    
    register : function(user,callback) {
        database.findOne("users",{email:user.email},(isIn) =>{
            if (isIn){
                callback("L'utilisateur existe déjà")
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
        let values = {$set: {information: {sexe: user.sexe, age: user.age, taille : user.taille, poid : user.poid, tabac: user.tabac, activite : user.activite, alimentation: user.alimentation}}};
        
        database.update("users",user.id,values,(msg) => callback(msg))
    },
    
    login: function(email,password,callback) {
        database.findOne("users",{email: email, password: password},(user) => {
            if (user){
                callback(user)
            }else{
                callback("Aucun utilisateur")
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
            console.log(user)
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
        let values ={lunch : {processedFood: food, lunchType: lunchType, createdAt: new Date() }} ;
         database.update("users",id,values, function(result){
            callback(result)
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
            callback(productInfo)
        })
    }     
    
    //db.recipes.find({     createdAt: {         $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)))      } })

}

module.exports = userService;