
var connect = require('connect')
    , express = require('express')
    , sys = require('sys')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

var server = express.createServer();
server.configure(function(){
  server.set('root', __dirname)
});

server.get('/', function(req,res){
  res.send("Hello World!");
});

server.get('/:link', function(req,res){
    res.send("Get uri for shorturl key: " + req.params.link);
});

server.get('/generate/:uri', function(req,res){
    res.send("Generate shorturl for: " + req.params.uri);
});

server.listen(port);

console.log('Listening on http://0.0.0.0:' + port );
