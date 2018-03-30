const userService = require('../services/user.service');
const foodService = require('../services/food.service');
const request = require('request');


var users = {
    
    register : function(req, res){
        if (req.body.user.email && req.body.user.password && req.body.user.login){
            userService.register(req.body.user,function(data){
                if (data){
                    res.send(data)
                }else{
                    res.status(400).send("L'email est déjà utilisé")
                }
            })
        }else{
            res.status(412).send()
        }
    },
    
    
    updateProfil : function(req, res){
        userService.updateProfil(req.body.user,function(data){
            res.send(data)
        })
    },
    
    login : function(req, res){
        if (req.body.email && req.body.password){
            userService.login(req.body.email,req.body.password, function(user){
                if(user){
                    res.send(user)
                }else{
                    res.status(400).send("L'utilisateur n'existe pas ou le mot de passe est incorrect")
                }
            })
        }else{
            res.status(412).send()
        }
    },
    
    getInfo : function(req, res){
        res.send(req.session.user)
    },
    
    getLunch : function(req, res){
        userService.getLunch(req.params.id,req.params.days,(data) =>{
        if (data){
                res.send(data.lunch)
            }else{
                res.status(400).send("Impossible de récuperer les repas")
            }
        })
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
        if (req.body.lunch) {
            userService.getFoodFromCode(req.body.code,function(product){
                if (product){
                    if (req.body.custom_quantity){
                        product["custom_quantity"] = req.body.custom_quantity;
                    }
                    userService.addProcessedFood(req.body.id,product,req.body.lunch,function(isOk){
                        res.send(isOk)
                    })
                }else{
                    res.status("400").send("Erreur dans l'ajout")
                }
            })
        }else{
            res.status(412).send()
        }
    },
    
    getFoodFromCode : function(req, res){
        if (req.params.id){
            userService.getFoodFromCode(req.params.id, function(product){
                if (product){
                    res.send(product)
                }
                else{
                    res.status(400).send("Le code barre ne correspond à aucun produit de la base de donnée")
                }
            })
        }else{
            res.status(412).send()
        }
    },
    
    GetUserAJR : function(req,res){
        let days = (req.params.days) || 30
        userService.getLunch(req.params.id,days,function(data){
            foodService.calculAJR(data.lunch,days,function(ajr){
                userService.getInfo(req.params.id,function(info){
                    console.log(parseFloat(info.poids))
                    ajr["sexe"] = info.sexe ;
                    ajr["age"] = parseInt(info.age);
                    ajr["taille"] = (parseFloat(info.taille)/100);
                    ajr["poids"] = parseFloat(info.poids);
                    ajr["IMC"] = parseFloat(info.poids)/(Math.pow((parseFloat(info.taille)/100), 2));
                    ajr["tabac"] = parseInt(info.tabac);
                    ajr["activite"] = parseInt(info.activite);
                    ajr["type_alim"] = parseInt(info.alimentation);
                    request.post({
                      headers: {'content-type' : 'application/json'},
                      url:     'http://localhost:5000/profile',
                      body:    JSON.stringify(ajr)
                    }, function(error, response, body){
                        body=JSON.parse(body);
                        let profil;
                        switch(parseInt(body.profile)){
                            case 0: profil = "exces de graisses"; break;
                            case 1: profil = "exces de sucres"; break;
                            case 2: profil = "exces de protéines"; break;
                            case 3: profil =  "carence en protéines"; break;
                            case 4: profil =  "carence en calories"; break;
                            case 5: profil =  "exces de sel"; break;
                            default: profil = "tout va bien"; 
                        }
                        
                      ajr["profil"] = profil;
                      res.send(ajr);
                    });
                })
            })
        })
    }
    
}
module.exports = users;
