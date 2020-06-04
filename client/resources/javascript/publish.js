var socket = io();

initializeFirebase();

var gameTitleOut = document.getElementById('gameTitleOut');
var gameTitleIn = document.getElementById('gameTitleIn');
var descriptionIn = document.getElementById('description');
var keywordDisplay = document.getElementById('keywordDisplay');
var keywordIn = document.getElementById('keywordIn');
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
