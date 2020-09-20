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

if ((window.location.href.split('?').length > 1)) {
  var myGames = document.getElementById('myGames');
  myGames.innerHTML = 'Go Back';
  myGames.href = 'main.html';
}

firebase.auth().onAuthStateChanged(function(user) {
  socket.emit('getPublishedGames');
  socket.on('publishedGamesRes', function(res) {
    socket.emit('getUserName', user.uid);
    socket.on('userNameRes', function(userRes) {
      var userName = userRes.firstName + ' ' + userRes.lastName;
      for (var gameName of Object.keys(res)) (function(gameName) {
        var game = res[gameName];

        var div = document.createElement('div');
        if ('backgroundColor' in game) {
          div.style.background = game.backgroundColor;
        }
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
        if ('fontColor' in game) {
          title.style.color = game.fontColor;
        }
        div.appendChild(title);

        var devMentions = document.createElement('p');
        if ('fontColor' in game) {
          devMentions.style.color = game.fontColor;
        }
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

        if ((window.location.href.split('?').length > 1)) {
          if (developers.includes(userName)) {
            var editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.style.textAlign = 'center';
            div.appendChild(editButton);
            document.getElementById('gamesDiv').appendChild(div);
          }
        } else {
          document.getElementById('gamesDiv').appendChild(div);
        }
      })(gameName)
      toggleIMGSize();
    })
  })
})

var slider = document.getElementById('imgSizeIn');

slider.oninput = toggleIMGSize;
