var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID; 

const config = require('../config.js').get(process.env.NODE_ENV);

//db.collections.find().sort(key:value).limit(int value).skip(some int value);


var database = {
    
    connect: function(callback) {
        MongoClient.connect(config.database, function(err, db) {
            callback(db,db.db("pfe"))
        })
    },
    
    getById: function(collection,id,callback){
        database.connect( (db,dbo) => {
           dbo.collection(collection).findOne({_id : ObjectID(id)}, function(err, data) {
                if (err) throw err;
                db.close();
                callback(data)
            });
        });
    },
        
    
    getAll: function(collection,options,callback){
        let limit = (options.limit && options.limit > 0) ? options.limit : 0 ;
        let skip = (options.skip && options.skip > 0) ? options.skip : 0 ;
        database.connect( (db,dbo) => {         
            dbo.collection(collection).find({}).skip(Math.trunc(skip)).limit(Math.trunc(limit))
                        .toArray(function(err, recipes) {
                            if (err) throw err;
                            db.close();
                            callback(recipes);
                        });
        });
    },
    
    update: function(collection,id,values,callback){
        database.connect( (db,dbo) => {
            dbo.collection(collection).update( id, values,function(err,result){
                if (err) throw err;
                db.close()
                return(res.send(result));
            })
        })
    }
    
}
    


module.exports = database;