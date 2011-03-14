var Clicks = require('./model').Model;

//findByLinkId
Clicks.prototype.findByLinkId = function(id, callback) {
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

exports.Clicks = Clicks;

