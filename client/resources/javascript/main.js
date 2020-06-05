var socket = io();

initializeFirebase();

function replaceAll(orig, toReplace, replaceWith) {
  var replaced = orig.replace(toReplace, replaceWith);
  while (replaced.includes(toReplace)) {
    replaced = replaced.replace(toReplace, replaceWith);
  }
  return replaced;
}

socket.emit('getPublishedGames');
socket.on('publishedGamesRes', function(res) {
  for (var gameName of Object.keys(res)) {
    var game = res[gameName];

    var div = document.createElement('div');
    div.classList.add('game');

    var img = document.createElement('img');
    img.src = game.thumbnail;
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
  }
})
