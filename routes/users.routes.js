const userService = require('../services/user.service');
const foodService = require('../services/food.service');

var users = {
    
    register : function(req, res){
        userService.register(req.body.user,function(data){
             res.send(data)
        })
    },
    
    
    updateProfil : function(req, res){
        userService.updateProfil(req.body.user,function(data){
            res.send(data)
        })
    },
    
    login : function(req, res){
        userService.login(req.body.email,req.body.password, function(user){
            res.send(user)
        })
    },
    
    getInfo : function(req, res){
        res.send(req.session.user)
    },
    
    addEatenRecipe : function(req, res){
        userService.addEatenRecipe(req.body.id,req.body.recipeID,req.body.lunch, function(isOk){
            if (isOk){
                res.send(isOk)
            }else{
                res.send("erreur")
            }
        })   
    },
    
    addEatenProcessedFood : function(req, res){
        userService.getFoodFromCode(req.body.code,function(product){
            if (product){
                userService.addProcessedFood(req.body.id,product,req.body.lunch,function(isOk){
                    res.send(isOk)
                })
            }
        })
    },
    
    getFoodFromCode : function(req, res){
        userService.getFoodFromCode(req.params.id, function(product){
            if (product){
                res.send(product)
            }
            else{
                res.send("error")
            }
        })
    },
    
    GetUserAJR : function(req,res){
        userService.getLunch(req.params.id,function(data){
            foodService.calculAJR(data,function(ajr){
                userService.getInfo(req.params.id,function(info){
                    ajr["sexe"] = info.sexe;
                    ajr["age"] = parseInt(info.age);
                    ajr["taille"] = (parseFloat(info.taille)/100);
                    ajr["poids"] = parseFloat(info.poid);
                    ajr["IMC"] = parseFloat(info.poid)/(Math.pow((parseFloat(info.taille)/100), 2));
                    ajr["tabac"] = parseInt(info.tabac);
                    ajr["activite"] = parseInt(info.activite);
                    ajr["type_alim"] = parseInt(info.alimentation);
                    res.send(ajr);
                })
            })
        })
    }
    
}
module.exports = users;
