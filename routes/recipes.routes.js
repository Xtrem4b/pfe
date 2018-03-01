var Recipe = require('../models/recipe')
var ingredient_service = require('../services/ingredients.service');
const database = require('../services/db.service')


var recipes = {
    
    getRecipes: function(req, res){
        database.getAll("recipes",req.query,(recipes) =>                            res.send(recipes.map(recipe => new Recipe(recipe)))
        )
    },      
    
    getRecipesById: function(req, res){
        database.getById("recipes",req.params.id,(recipe) =>
           res.send(recipe) 
        )
    },
    
    getAJR: function(req,res){
        database.getById("recipes",req.params.id,(recipe) => {
            ingredient_service.getBySynonyme(recipe.ingredients.map(x => x.ingredient.replace(/^ +/gm, '')),(ingredients) => 
                res.send(ingredients)
                )
        })
    }
    
}

module.exports = recipes;