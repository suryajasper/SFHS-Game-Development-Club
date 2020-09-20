var socket = io();

initializeFirebase();

var serialized = { name: '', description: '', genre: '', datePublished: '', keywords: [], developers: [], thumbnail: null, links: [] };

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
var developerDiv = document.getElementById('developerDiv');
var developerOut = document.getElementById('devOut');
var linkDiv = document.getElementById('links');

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
    reader.onload = function() {
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

function refreshLinks() {
    serialized.links = [];
    $('#linksOut').empty();
    for (var i = 0; i < linkDiv.children.length; i += 3) {
        serialized.links.push({ title: linkDiv.children[i].value, url: linkDiv.children[i + 1].value });
        if (linkDiv.children[i + 1].value !== '') {

            var title = document.createElement('h2');
            title.innerHTML = linkDiv.children[i].value;
            document.getElementById('linksOut').appendChild(title);

            var iframe;
            if (linkDiv.children[i + 1].value.includes('www.youtube.com/watch?v=')) {
                iframe = document.createElement('iframe');
                iframe.width = "480";
                iframe.height = "270";
                iframe.src = linkDiv.children[i + 1].value.replace('watch?v=', 'embed/');
            } else {
                iframe = document.createElement('a');
                iframe.innerHTML = linkDiv.children[i + 1].value;
                iframe.href = linkDiv.children[i + 1].value;
                iframe.style.display = 'inline-block';
            }
            document.getElementById('linksOut').appendChild(iframe);
        }
    }
}

document.getElementById('addLink').onclick = function(e) {
    e.preventDefault();

    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'title';
    titleInput.style.display = 'inline-block';
    titleInput.style.width = '250px';
    titleInput.oninput = refreshLinks;

    var linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.placeholder = 'url';
    linkInput.style.display = 'inline-block';
    linkInput.style.width = '250px';
    linkInput.oninput = refreshLinks;

    var br = document.createElement('br');

    linkDiv.appendChild(titleInput);
    linkDiv.appendChild(linkInput);
    linkDiv.appendChild(br);
}

setDate();

firebase.auth().onAuthStateChanged(function(user) {
    socket.emit('getUserName', user.uid);
    socket.on('userNameRes', function(name) {
        serialized.developers.push(name.firstName + ' ' + name.lastName);
        developerOut.innerHTML = name.firstName + ' ' + name.lastName;
    })
    publishButton.onclick = function(e) {
        e.preventDefault();
        socket.emit('publishGame', user.uid, serialized.name, serialized);
        window.location.href = '/customizeCard.html?' + serialized.name;
    }
})