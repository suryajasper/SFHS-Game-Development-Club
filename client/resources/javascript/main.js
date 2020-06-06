var socket = io();

initializeFirebase();

function replaceAll(orig, toReplace, replaceWith) {
  var replaced = orig.replace(toReplace, replaceWith);
  while (replaced.includes(toReplace)) {
    replaced = replaced.replace(toReplace, replaceWith);
  }
  return replaced;
}

function toggleIMGSize() {
  for (var gameDiv of document.getElementsByClassName('game')) {
    gameDiv.children[0].style.width = parseInt(parseFloat(slider.value) * 5/3).toString() + 'px';
    gameDiv.children[0].style.height = slider.value.toString() + 'px';

    gameDiv.children[1].style.fontSize = (parseFloat(slider.value)/200).toString() + 'em';
    gameDiv.children[1].style.margin = (parseFloat(slider.value)/30).toString() + 'px';

    gameDiv.children[2].style.fontSize = (parseFloat(slider.value)/300).toString() + 'em';
    gameDiv.children[2].style.marginTop = (parseFloat(slider.value)/75).toString() + 'px';
  }
}

socket.emit('getPublishedGames');
socket.on('publishedGamesRes', function(res) {
  for (var gameName of Object.keys(res)) (function(gameName) {
    var game = res[gameName];

    var div = document.createElement('div');
    div.classList.add('game');

    var img = document.createElement('img');
    img.src = game.thumbnail;
    img.style.cursor = 'pointer';
    img.onclick = function() {
      window.location.href = '/game.html?' + gameName;
    }
    div.appendChild(img);

    var title = document.createElement('h2');
    title.innerHTML = gameName;
    div.appendChild(title);

    var devMentions = document.createElement('p');
    devMentions.classList.add('developers');
    var developers = 'by ' + game.developers[0];
    for (var i = 1; i < game.developers.length; i++) {
      if (i == game.developers.length-1) {
        developers += ', and ' + game.developers[i];
      } else {
        developers += ', ' + game.developers[i];
      }
    }
    devMentions.innerHTML = developers;
    div.appendChild(devMentions);

    document.getElementById('gamesDiv').appendChild(div);
  })(gameName)
  toggleIMGSize();
})

var slider = document.getElementById('imgSizeIn');

slider.oninput = toggleIMGSize;
