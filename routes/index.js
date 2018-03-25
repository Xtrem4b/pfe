var ingredients = require('./ingredients.routes.js');
var recipes = require('./recipes.routes.js');
var users = require('./users.routes.js');

module.exports = function(app){
    
    
/*return all categories*/
app.get('/api/ingredients/categories', ingredients.categories)
/*return ingredient from the categorie in params*/
app.get('/api/ingredients/category', ingredients.category)
/*return ingredient from his id*/
app.get('/api/ingredients/:id', ingredients.ingredientById)
/*update the list of synonymes of the ingredient with id in params*/
app.put('/api/ingredients/update', ingredients.updateSynonyme)
/*return all recipes (with limit option and skip option)*/
app.get('/api/drop/ingredients',ingredients.reset)
    
app.get('/api/create/ingredients',ingredients.create)
    

app.get('/api/recipes', recipes.getRecipes)
/*return recipe by id*/
app.get('/api/recipe/:id', recipes.getRecipesById)

app.get('/api/recipe/ajr/:id', recipes.getAJR)
    
app.post('/api/new/recipe',recipes.addRecipe)

    
    
    
    
app.post('/api/login', users.login)
    
app.get("/api/openFoodFact/:id", users.getFoodFromCode)
    
app.post('/api/register',users.register)
    
app.put('/api/profil/update',users.updateProfil)
    
app.post('/api/profil/update/processedFood',users.addEatenProcessedFood)
    
app.post('/api/profil/update/eatenRecipe',users.addEatenRecipe)
    
app.get('/api/profil/getAJR/:id/:days',users.GetUserAJR)
    
    
    
}

/*
{
	"user": { "email":"meuniernat@eisti.eu",
    "password": "123",
    "pseudo": "meuniernat",
    "information": null,
    "lunch": []
	}
}
*/