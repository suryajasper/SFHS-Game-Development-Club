var socket = io();

initializeFirebase();

function replaceAll(orig, toReplace, replaceWith) {
  var replaced = orig.replace(toReplace, replaceWith);
  while (replaced.includes(toReplace)) {
    replaced = replaced.replace(toReplace, replaceWith);
  }
  return replaced;
}

var serialized = {backgroundColor: null, fontColor: null};

var gameDiv = document.getElementsByClassName('game')[0];
var h2 = gameDiv.children[1];
var p = gameDiv.children[2];

document.getElementById('backgroundColorPicker').oninput = function() {
  serialized.backgroundColor = this.value;
  gameDiv.style.background = this.value;

}
document.getElementById('fontColorPicker').oninput = function() {
  serialized.fontColor = this.value;
  h2.style.color = this.value;
  p.style.color = this.value;
}

document.getElementById('publishButton').onclick = function(e) {
  e.preventDefault();
  console.log(serialized);
  console.log(replaceAll(window.location.href.split('?')[1], '%20', ' '));
  socket.emit('changeColor', replaceAll(window.location.href.split('?')[1], '%20', ' '), serialized);
  window.location.href = '/main.html';
}

socket.emit('getGameInfo', replaceAll(window.location.href.split('?')[1], '%20', ' '));
socket.on('gameInfoRes', function(game) {
  document.getElementById('gameName').innerHTML = game.name;

  var developers = 'by ' + game.developers[0];
  for (var i = 1; i < game.developers.length; i++) {
    if (i == game.developers.length-1) {
      developers += ', and ' + game.developers[i];
    } else {
      developers += ', ' + game.developers[i];
    }
  }
  document.getElementById('devName').innerHTML = developers;
})
