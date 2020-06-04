var admin = require("firebase-admin");
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'));
var port = process.env.PORT || 9000;

io.on('connection', function(socket){

})

http.listen(port, function(){
  console.log('listening on port ' + port.toString());
});
