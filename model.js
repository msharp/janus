var sys = require("sys"),
    mongo = require('mongodb'),
    ObjectID = mongo.ObjectID;

// maps a model to a collection (adapted from: https://github.com/weekface/jscms/)
Model = function(col, db, host, port) {
  this.db= new mongo.Db(db, new mongo.Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
  this.collection_name = col;
};

//getCollection
Model.prototype.getCollection = function(callback) {
  this.db.collection(this.collection_name, function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

//findAll
Model.prototype.findAll = function(callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find(function(error, cursor) {
          if( error ) callback(error)
          else {
            cursor.toArray(function(error, results) {
              if( error ) callback(error)
              else callback(null, results)
            });
          }
        });
      }
    });
};

// countDocuments
Model.prototype.countAll = function(callback) {
  this.findAll(function(error,results){
    if( error ) callback(error)
    else {
      callback(null, results.length);
    } 
  });
};

//findById
Model.prototype.findById = function(id, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.findOne({_id: ObjectID(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//save
Model.prototype.save = function(items, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        if( typeof(items.length)=="undefined")
          items = [items];
        collection.insert(items, function() {
          callback(null, items);
        });
      }
    });
};


exports.Model = Model;
