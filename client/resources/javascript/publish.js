var socket = io();

initializeFirebase();

var serialized = {name: '', description: '', genre: '', datePublished: '', keywords: [], developers: [], thumbnail: null};

function replaceAll(orig, toReplace, replaceWith) {
  var replaced = orig.replace(toReplace, replaceWith);
  while (replaced.includes(toReplace)) {
    replaced = replaced.replace(toReplace, replaceWith);
  }
  return replaced;
}

function setDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  document.getElementById('datePublishedOut').innerHTML = today;
  serialized.datePublished = today;
}

var gameTitleOut = document.getElementById('gameTitleOut');
var gameTitleIn = document.getElementById('gameTitleIn');
var descriptionIn = document.getElementById('description');
var keywordDisplay = document.getElementById('keywordDisplay');
var keywordIn = document.getElementById('keywordIn');
var keywordEnter = document.getElementById('enterKeyword');
var thumbnailImg = document.getElementById('displayThumbnail');
var thumbnailIn = document.getElementById('inputThumbnail');
var gameFileUpload = document.getElementById('inputGameFile');
var developerDiv = document.getElementById('developerDiv');
var developerOut = document.getElementById('devOut');

gameTitleIn.oninput = function() {
  if (gameTitleIn.value.length > 0) {
    gameTitleOut.innerHTML = gameTitleIn.value;
    serialized.name = gameTitleIn.value;
  } else {
    gameTitleOut.innerHTML = 'Game Title';
  }
}

descriptionIn.oninput = function() {
  if (descriptionIn.value.length > 0) {
    document.getElementById('descriptionOut').innerHTML = replaceAll(descriptionIn.value, '\n', '<br>');
    serialized.description = descriptionIn.value;
  } else {
    document.getElementById('descriptionOut').innerHTML = 'Game Description';
  }
}

keywordEnter.onclick = function(e) {
  e.preventDefault();
  if (replaceAll(keywordIn.value, ' ', '') !== '' && !(serialized.keywords.includes(keywordIn.value.toLowerCase()))) {
    var p = document.createElement('p');
    p.innerHTML = keywordIn.value;
    p.classList.add('keyword');
    keywordDisplay.appendChild(p);
    serialized.keywords.push(keywordIn.value.toLowerCase());
    keywordIn.value = '';
  }
}

thumbnailIn.onchange = function(event) {
  var reader = new FileReader();
  reader.onload = function(){
    thumbnailImg.src = reader.result;
    serialized.thumbnail = reader.result;
  }
  reader.readAsDataURL(event.target.files[0]);
}

function refreshDevelopers() {
  serialized.developers = [developerOut.innerHTML.split(',')[0]];
  developerOut.innerHTML = developerOut.innerHTML.split(',')[0];

  for (var input of developerDiv.children) {
    serialized.developers.push(input.value);
    developerOut.innerHTML += ', ' + input.value;
  }
}

document.getElementById('addDeveloper').onclick = function(e) {
  e.preventDefault();
  var input = document.createElement('input');
  input.type = 'text';
  input.oninput = refreshDevelopers;
  developerDiv.appendChild(input);
}

setDate();

firebase.auth().onAuthStateChanged(function(user) {
  socket.emit('getUserName', user.uid);
  socket.on('userNameRes', function(name) {
    developerOut.innerHTML = name.firstName + ' ' + name.lastName;
  })
  publishButton.onclick = function(e) {
    e.preventDefault();
    socket.emit('publishGame', user.uid, serialized.name, serialized);
  }
})
