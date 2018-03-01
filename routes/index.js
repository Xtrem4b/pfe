var ingredients = require('./ingredients.routes.js');
var recipes = require('./recipes.routes.js');

module.exports = function(app){
require('./users.routes')(app)
    
    
/*return all categories*/
app.get('/ingredients/categories', ingredients.categories)
/*return ingredient from the categorie in params*/
app.get('/ingredients/category', ingredients.category)
/*return ingredient from his id*/
app.get('/ingredients/:id', ingredients.ingredientById)
/*update the list of synonymes of the ingredient with id in params*/
app.put('/ingredients/update', ingredients.updateSynonyme)

/*return all recipes (with limit option and skip option)*/
app.get('/recipes', recipes.getRecipes)
/*return recipe by id*/
app.get('/recipe/:id', recipes.getRecipesById)

app.get('/recipe/ajr/:id', recipes.getAJR)

//app.put('/recipe/update/:id', recipes.updateSynonyme)

}