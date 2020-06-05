var admin = require("firebase-admin");
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'));
var port = process.env.PORT || 9000;


var database = admin.database();
var userInfo = database.ref('userInfo');
var games = database.ref('games');

io.on('connection', function(socket){
  socket.on('createUser', function(userID, _firstName, _lastName) {
    userInfo.child(userID).update({firstName: _firstName, lastName: _lastName});
  });
  socket.on('getUserName', function(userID) {
    userInfo.child(userID).once('value', function(snapshot) {
      socket.emit('userNameRes', snapshot.val());
    })
  });

  socket.on('publishGame', function(userID, name, gameObj) {
    userInfo.child(userID).once('value', function(snapshot) {
      var currGames = snapshot.val();
      if (currGames !== null && 'games' in currGames) {
        var update = {};
        update[Object.keys(currGames).length] = name;
        userInfo.child(userID).child('games').update(update);
      } else {
        userInfo.child(userID).update({'games': {0: name}});
      }
    })
    var gamesUpdate = {};
    gamesUpdate[name] = gameObj;
    games.update(gamesUpdate);
  });
})

http.listen(port, function(){
  console.log('listening on port ' + port.toString());
});
