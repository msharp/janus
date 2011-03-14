var Links = require('./model').Model;

//findByLinkId
Links.prototype.findByLinkId = function(id, callback) {
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

exports.Links = Links;

