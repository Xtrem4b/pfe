const database = require('../services/db.service')
const puppeteer = require("puppeteer");
const ingredient_service = require('../services/ingredients.service');


var recipes_service = {
    
    getRecipeFromUrl: async function(url,callback){
        let browser = await puppeteer.launch({headless: true});
        let page = await browser.newPage();
        await page.goto(url);
        let recipe = await page.evaluate(() => {
            console.log("here")
            var ingredientsList = [];
            var stepList = [];
            let title = document.querySelector(".main-title").innerHTML;
            let ingredients = document.querySelectorAll(".recipe-ingredients__list > li");
            for (var element of ingredients){ 
                   var ingredient = element.querySelector('p').getAttribute("data-name-singular")
                   var quantity = element.querySelector('span').innerHTML
                   ingredientsList.push({"ingredient":ingredient,"quantity":quantity});
            }
            let step = document.querySelectorAll(".recipe-preparation__list > li");   
            step.forEach(elt => stepList.push(elt.textContent));
            let time = document.querySelector(".recipe-infos__total-time__value").innerHTML;
            return {
                title: title,
                ingredients: ingredientsList,
                step: stepList,
                time: time
            };
        });
        database.insert("recipes",recipe,(data) => callback(data))
        await page.waitFor(500);
        await browser.close();
    },
    
    getRecipes: function(query,callback){
       database.getAll("recipes",query,(recipes) => {
             callback(recipes.map(recipe => new Recipe(recipe).data))
            }
        ) 
    },
    
    getRecipeById: function(id,callback){
        database.getById("recipes",id,(recipe) =>
           callback(new Recipe(recipe).data)
        ) 
    },
    
    getRecipeAJR: function(id,callback){
        database.getById("recipes",id,(recipe) => {
            if (recipe){
                ingredient_service.getBySynonyme(recipe.ingredients.map(x => x.ingredient.replace(/^ +/gm, '')),(ingredients) => 
                    callback(ingredients)
                )
            }else {
                callback("erreur")
            }
        })
    }   
}


module.exports = recipes_service;
