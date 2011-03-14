var Links = require('./model').Model;

//findByLinkId
Links.prototype.findByLinkId = function(id, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find({link_id: id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

exports.Links = Links;

