var Recipe = require('../models/recipe')
var ingredient_service = require('../services/ingredients.service');
const database = require('../services/db.service')
const recipe_service = require('../services/recipes.service');


var recipes = {
    getRecipes: function(req, res){
        recipe_service.getRecipes(req.query,(recipes) =>
            res.send(recipes))
    },      
    
    getRecipesById: function(req, res){
        recipe_service.getRecipeById(req.params.id,(recipe) =>
            res.send(recipe)
        ) 
    },
    
    getAJR: function(req,res){
        recipe_service.getRecipeAJR(req.params.id,(ajr) => 
            res.send(ajr)
        )
    },
    
    addRecipe : function(req,res){
        recipe_service.getRecipeFromUrl(req.body.url,(msg) =>
            res.send(msg)
        )
    }
    
}

module.exports = recipes;