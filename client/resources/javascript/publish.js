var socket = io();

function replaceAll(orig, toReplace, replaceWith) {
  var replaced = orig.replace(toReplace, replaceWith);
  while (replaced.includes(toReplace)) {
    replaced = replaced.replace(toReplace, replaceWith);
  }
  return replaced;
}

initializeFirebase();

var gameTitleOut = document.getElementById('gameTitleOut');
var gameTitleIn = document.getElementById('gameTitleIn');
var descriptionIn = document.getElementById('description');
var keywordDisplay = document.getElementById('keywordDisplay');
var keywordIn = document.getElementById('keywordIn');
var keywordEnter = document.getElementById('enterKeyword');
var thumbnailImg = document.getElementById('displayThumbnail');
var thumbnailIn = document.getElementById('thumbnailIn');
var gameFileUpload = document.getElementById('inputGameFile');

gameTitleIn.oninput = function() {
  if (gameTitleIn.value.length > 0) {
    gameTitleOut.innerHTML = gameTitleIn.value;
  } else {
    gameTitleOut.innerHTML = 'Game Title';
  }
}

descriptionIn.oninput = function() {
  if (descriptionIn.value.length > 0) {
    document.getElementById('descriptionOut').innerHTML = replaceAll(descriptionIn.value, '\n', '<br>');
  } else {
    document.getElementById('descriptionOut').innerHTML = 'Game Description';
  }
}

keywordEnter.onclick = function(e) {
  e.preventDefault();
  var p = document.createElement('p');
  p.innerHTML = keywordIn.value;
  p.classList.add('keyword');
  keywordDisplay.appendChild(p);
  keywordIn.value = '';
}
