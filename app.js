var connect = require('connect')
    , express = require('express')
    , sys = require('sys')
    , port = (process.env.PORT || 8081);

var server = express.createServer();
server.configure(function(){
  server.set('root', __dirname)
});

server.get('/', function(req,res){
  res.send("Hello World!");
});

server.get('/generate', function(req,res){
    res.send("Generate shorturl for: " + req.query.url);
});

server.get('/:link', function(req,res){
    res.send("Get uri for shorturl key: " + req.params.link);
});

server.listen(port);

console.log('Listening on http://0.0.0.0:' + port );

