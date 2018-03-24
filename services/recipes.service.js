const database = require('../services/db.service')
const puppeteer = require("puppeteer");

var recipes_service = {
    
    getRecipeFromUrl: async function(url,callback){
        console.log(url)
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
        console.log("here2")
        database.insert("recipes",recipe,(data) => callback(data))

        await page.waitFor(500);
        await browser.close();
    }
        
        
        
}


module.exports = recipes_service;