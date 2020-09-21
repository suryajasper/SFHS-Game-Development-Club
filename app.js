var admin = require("firebase-admin");
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'));
var port = process.env.PORT || 9000;

var serviceAccount = require("/Users/suryajasper2004/Downloads/sfhs-gamedevclub-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sfhs-gamedevclub.firebaseio.com"
});

var database = admin.database();
var userInfo = database.ref('userInfo');
var games = database.ref('games');
var questions = database.ref('questions');

io.on('connection', function(socket) {
    socket.on('createUser', function(userID, _firstName, _lastName) {
        userInfo.child(userID).update({ firstName: _firstName, lastName: _lastName });
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
                update[Object.keys(currGames['games']).length] = name;
                userInfo.child(userID).child('games').update(update);
            } else {
                userInfo.child(userID).update({ 'games': { 0: name } });
            }
        })
        var gamesUpdate = {};
        gamesUpdate[name] = gameObj;
        games.update(gamesUpdate);
    });

    socket.on('changeColor', function(gameName, colorObj) {
        games.child(gameName).update(colorObj);
    })

    socket.on('getPublishedGames', function() {
        games.once('value', function(snapshot) {
            socket.emit('publishedGamesRes', snapshot.val());
        })
    })

    socket.on('getGameInfo', function(gameName) {
        games.child(gameName).once('value', function(snapshot) {
            socket.emit('gameInfoRes', snapshot.val());
        })
    })

    socket.on('askQuestion', function(userID, data) {
        data.askerID = userID;
        var date = (new Date()).getTime();
        questions.child(data.topic).child(date).set(data);

        var userQuest = {};
        userQuest[date] = data.topic;
        userInfo.child(userID).child('questions').update(userQuest);
    })

    socket.on('getQuestions', function() {
        questions.once('value', function(snapshot) {
            socket.emit('questionsRes', snapshot.val());
        })
    })
})

http.listen(port, function() {
    console.log('listening on port ' + port.toString());
});