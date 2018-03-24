var Recipe = require('../models/recipe')
var ingredient_service = require('../services/ingredients.service');
const database = require('../services/db.service')


var recipes = {
    /*Attention a bien mettre data*/
    getRecipes: function(req, res){
        database.getAll("recipes",req.query,(recipes) => {
             res.send(recipes.map(recipe => new Recipe(recipe).data))
            }
        )
    },      
    
    getRecipesById: function(req, res){
        database.getById("recipes",req.params.id,(recipe) =>
           res.send(new Recipe(recipe).data)
        ) 
        
    },
    
    getAJR: function(req,res){
        database.getById("recipes",req.params.id,(recipe) => {
            if (recipe){
                ingredient_service.getBySynonyme(recipe.ingredients.map(x => x.ingredient.replace(/^ +/gm, '')),(ingredients) => 
                    res.send(ingredients)
                    )
            }else{
                res.send("erreur")
            }
        })
    }
    
}

module.exports = recipes;