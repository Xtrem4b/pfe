var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID; 

const config = require('../config.js').get(process.env.NODE_ENV);

//TODO: check params
var database = {
    
    connect: function(callback) {
        MongoClient.connect(config.database, function(err, db) {
            callback(db,db.db("pfe"))
        })
    },
    
    insert: function(collection,data,callback) {
        data["createdAt"] = new Date() ;
        database.connect((db,dbo) => {
            dbo.collection(collection).insert(data,function (err,data){
                if (err) throw err;
                db.close();
                callback(data)
            })
        })
    },
    
    findOne: function(collection,options,callback) {
        database.connect((db,dbo) => {
            dbo.collection(collection).findOne(options.query,function (err,data){
                if (err) throw err;
                db.close();
                callback(data)
            })
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
    
    getLunchByDays: function(id,days,callback){
        database.connect( (db,dbo) => {
           dbo.collection("users").findOne({_id: ObjectID(id) ,lunch:{ $elemMatch : {createdAt: {$gte: new Date((new Date().getTime() - (days * 24 * 60 * 60 * 1000)))}} }},function(err, data) {
                if (err) throw err;
                db.close();
                callback(data)
            });
        });
    },
    
    getDistinct: function(collection,field,callback){
        database.connect((db,dbo)=>{
            dbo.collection(collection).distinct(field,function(err,data){
                if (err) throw err;
                db.close();
                callback(data)
            })
        })
    },
            
    getAll: function(collection,options,callback){
        let query = (options.query) ? options.query : {};
        let limit = (options.limit && options.limit > 0) ? options.limit : 0 ;
        let skip = (options.skip && options.skip > 0) ? options.skip : 0 ;
        database.connect( (db,dbo) => {         
        dbo.collection(collection).find(query).skip(Math.trunc(skip)).limit(Math.trunc(limit))
                .toArray(function(err, data) {
                    if (err) throw err;
                    db.close();
                    callback(data);
                });
        });
    },
    
    update: function(collection,id,values,callback){
        database.connect( (db,dbo) => {
            dbo.collection(collection).update({_id : ObjectID(id)}, {
             $push: values 
            },function(err,result){
                if (err) throw err;
                db.close()
                callback(result)
            })
        })
    }  
}

module.exports = database;