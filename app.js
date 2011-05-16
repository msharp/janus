var connect = require('connect'),
    express = require('express'),
    sys = require('sys'),
    port = (process.env.PORT || 8081),
    mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/janus');


var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Link = new Schema({
    id: ObjectId,
    link_id: String,
    url: String,
    generate_date: {type: Date, default: Date.now},

}); 
mongoose.model('Link',Link);

var Click = new Schema({
    id : ObjectId,
    link_id: String,
    time: {type: Date, default: Date.now},
    http_headers: {}
});
mongoose.model('Click',Click);

var link = mongoose.model('Link');
var click = mongoose.model('Click');

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
  link.find({}, function(error,items){
    var link_count = items.length+2;
    var short_code = encode52(link_count);
    var newLink = new link();
    newLink.link_id = short_code;
    newLink.url = url;
    newLink.save(function(err){
    });
    console.log("Generated shorturl number " + link_count + " as "+ newLink.link_id +" for: " + newLink.url);
  });  
});

server.get('/clicks/:link', function(req,res){
  var link_id = req.params.link;
  console.log('find click requests for link_id ' + link_id);
  click.find({'link_id':link_id}, function(err,items){
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

