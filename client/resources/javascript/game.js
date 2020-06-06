var socket = io();

function replaceAll(orig, toReplace, replaceWith) {
  var replaced = orig.replace(toReplace, replaceWith);
  while (replaced.includes(toReplace)) {
    replaced = replaced.replace(toReplace, replaceWith);
  }
  return replaced;
}

var gameTitleOut = document.getElementById('gameTitleOut');
var keywordDisplay = document.getElementById('keywordDisplay');
var thumbnailImg = document.getElementById('displayThumbnail');
var developerOut = document.getElementById('devOut');
var main = document.getElementById('main');

initializeFirebase();

socket.emit('getGameInfo', replaceAll(window.location.href.split('?')[1], '%20', ' '));

socket.on('gameInfoRes', function(game) {
  document.getElementById('descriptionOut').innerHTML = replaceAll(game.description, '\n', '<br>');
  document.getElementById('gameTitleOut').innerHTML = game.name;
  document.getElementById('genreOut').innerHTML = game.genre;
  document.getElementById('datePublishedOut').innerHTML = game.datePublished;

  developerOut.innerHTML = game.developers[0];
  for (var i = 1; i < game.developers.length; i++) {
    if (i == game.developers.length-1) {
      developerOut.innerHTML += ', and ' + game.developers[i];
    } else {
      developerOut.innerHTML += ', ' + game.developers[i];
    }
  }

  for (keyword of Object.keys(game.keywords)) {
    var p = document.createElement('p');
    p.classList.add('keyword');
    p.innerHTML = game.keywords[keyword];

    keywordDisplay.appendChild(p);
  }

  thumbnailImg.src = game.thumbnail;

  if ('links' in game) {
    for (var i = 0; i < Object.keys(game.links).length; i++) {
      var link = game.links[i];

      var h2 = document.createElement('h2');
      h2.innerHTML = link.title;
      main.appendChild(h2);

      var iframe;
      if (link.url.includes('www.youtube.com/watch?v=')) {
        iframe = document.createElement('iframe');
        iframe.width = "480";
        iframe.height = "270";
        iframe.src = link.url.replace('watch?v=', 'embed/');
      } else {
        iframe = document.createElement('a');
        iframe.innerHTML = link.url;
        iframe.href = link.url;
        iframe.style.display = 'inline-block';
      }
      main.appendChild(iframe);
    }
  }
})
