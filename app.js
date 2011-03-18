var connect = require('connect'),
    express = require('express'),
    mongoose = require('mongoose'),
    sys = require('sys'),
    port = (process.env.PORT || 8081);

require('./models/links');
require('./models/clicks');

mongoose.connect('mongodb://localhost/janus'); // connect to mongo
var link = mongoose.model('Link');
var click = mongoose.model('Click');

/*
var Clicks = require('./model').Model;

//findByLinkId
Links.prototype.findByLinkId = function(lid, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.findOne({link_id: lid}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

Clicks.prototype.findByLinkId = function(lid, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find({link_id: lid}, function(error, cursor) {
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

Links = new Model('links','janus','localhost', 27017);
Clicks = new Model('clicks','janus','localhost',27017);
*/

// encode number (base10) as base52 [a-Z]
function encode52(c) {
    return (c < 52 ? '' : encode52(parseInt(c / 52))) + ((c = c % 52) > 25 ? String.fromCharCode(c + 39) : String.fromCharCode(c + 97));
};

/* /////////////////////////////////
------------ routes ----------------
///////////////////////////////// */

var server = express.createServer();
server.configure(function(){
  server.set('root', __dirname)
});

server.get('/', function(req,res){
  res.send("Hello World!");
});

server.get('/generate', function(req,res){
  var url = req.query.url;
  var link_count = 0;
  Links.countAll(function(error,result){
    link_count = result;
    var short_code = encode52(link_count+1);
    var link = {"link_id": short_code, "url": url}
    Links.save(link, function(err,lnk){
      res.send(lnk[0]);
      console.log("Generated shorturl number " + link_count + " as "+ link.link_id +" for: " + link.url);
    });
  });
});

server.get('/clicks/:link', function(req,res){
  var link_id = req.params.link;
  console.log('find click requests for link_id ' + link_id);
  Clicks.findByLinkId(link_id, function(err,items){
    if(err)
      console.log(err);
    else if(items=='undefined') 
      res.send('[]');
    else if(items.length==0) 
      res.send('[]');
    else{
      res.send(JSON.stringify(items));
      console.log(JSON.stringify(items));
    }  
  });
});

server.get('/favicon.ico', function(){});

server.get('/:link', function(req,res){
  
  var linkid = req.params.link;
  console.log("got linkid " + linkid);
  
  link.find({link_id:linkid}, function(err,docs){
      if (err){
        console.log("error");
        res.send("error");
      }  
      else if ( typeof docs[0] == 'undefined'){
        console.log("link not found");
        res.send("link not found");
      }
      else{  
        console.log('found url ' + docs[0].url);
        
        var clickReport = new click();
        clickReport.link_id = linkid;
        clickReport.user_agent =  req.header('User-Agent'), 
        clickReport.referrer = req.header('Referrer'), 
        clickReport.from = req.header('From'), 
        clickReport.time = new Date()
        clickReport.save(function(err){});

        res.redirect(docs[0].url);
      } 
  });

});

server.listen(port);

console.log('Listening on http://0.0.0.0:' + port );

