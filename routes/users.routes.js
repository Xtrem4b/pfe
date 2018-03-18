const userService = require('../services/user.service');


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
    }
    
}
module.exports = users;

/*
module.exports = function(app){


app.get('/user/authenticate', function (req,res){res.send("toto")})

app.get('/user/information', function (req,res){res.send("toto")})

app.get('/user/ajr/:id', function (req,res){res.send("toto")})

app.get('/user/ingredients', function (req,res){res.send("toto")})
    
app.post('/user/new/recipe', function (req,res){res.send("toto")})

app.post('/user/add/launch', function (req,res){res.send("toto")})

app.delete('/user/delete/launch', function (req,res){res.send("toto")})

}*/

