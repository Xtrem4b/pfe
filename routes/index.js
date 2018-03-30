var ingredients = require('./ingredients.routes.js');
var recipes = require('./recipes.routes.js');
var users = require('./users.routes.js');

module.exports = function(app){
    
app.get('/api/ingredients/categories', ingredients.categories)
app.get('/api/ingredients/category', ingredients.category)
app.get('/api/ingredients/:id', ingredients.ingredientById)
app.put('/api/ingredients/update', ingredients.updateSynonyme)
app.get('/api/drop/ingredients',ingredients.reset)
app.post('/api/create/ingredients',ingredients.create)
    
app.get('/api/recipes', recipes.getRecipes)
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
app.get('/api/profil/getLunch/:id/:days',users.getLunch)
    
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