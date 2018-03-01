module.exports = function(app){

app.get('/user/authenticate', function (req,res){res.send("toto")})

app.get('/user/information', function (req,res){res.send("toto")})

app.get('/user/ajr/:id', function (req,res){res.send("toto")})

app.get('/user/ingredients', function (req,res){res.send("toto")})
    
app.post('/user/new/recipe', function (req,res){res.send("toto")})

app.post('/user/add/launch', function (req,res){res.send("toto")})

app.delete('/user/delete/launch', function (req,res){res.send("toto")})

}