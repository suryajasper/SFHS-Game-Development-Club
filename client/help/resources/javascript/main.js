initializeFirebase();

var socket = io();

var sortType = 'byTopic';

document.getElementById('askQuestion').onclick = function() {
    document.getElementById('askQuestionPopup').style.display = 'block';
}

document.getElementById('cancelAskQuestion').onclick = function() {
    document.getElementById('askQuestionPopup').style.display = 'none';
}

function refresh() {
    document.getElementById('refreshGraphic').classList.add('rotate');
    $('#questionPanel').empty();
    addQuestions(sortType);
}

document.getElementById('refresh').onclick = refresh;

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

var mouseOverStuff = { answerDiv: null, questionDiv: null };

function addQuestions(sort) {
    socket.emit('getQuestions');
    socket.on('questionsRes', function(res) {
        var byDate = {};
        var byTopic = {};
        if (res !== null) {
            $('#questionPanel').empty();
            for (var topic of Object.keys(res)) {
                byTopic[topic] = [];
                for (var date of Object.keys(res[topic])) {
                    var question = res[topic][date];
                    var div = document.createElement('div');
                    div.classList.add('questionBlock');
                    var dateObj = new Date(parseInt(date));
                    div.innerHTML = '<div class = "questionBlockInner"><p class = "questionBlockQuestion">' + question.question + '</p>' +
                        '<p class = "questionBlockTopic">' + question.topic.replaceAll('__sharp__', '#') + '</p>' +
                        '<p class = "questionBlockDate">' + dateObj.toLocaleDateString() + ' @ ' + dateObj.toLocaleTimeString() + '</p>' +
                        '<p class = "questionBlockDescription">' + question.description + '</p></div>';

                    if (date in byDate) byDate[date].push(div);
                    else byDate[date] = [div];

                    div.onclick = function() {
                        console.log('bruh');
                        if (mouseOverStuff.answerDiv !== null) {
                            if (mouseOverStuff.questionDiv !== this) {
                                mouseOverStuff.answerDiv.remove();
                                mouseOverStuff.questionDiv.style.marginBottom = '10px';
                            } else {
                                return;
                            }
                        }

                        this.style.marginBottom = '0px';

                        var answerDiv = document.createElement('div');
                        answerDiv.classList.add('answerDiv');

                        var answerDivInput = document.createElement('textarea');
                        answerDivInput.classList.add('answerDivInput');
                        answerDiv.appendChild(answerDivInput);

                        var answerDivBottomRight = document.createElement('div');
                        answerDivBottomRight.classList.add('answerDivBottomRight');

                        var cancelButton = document.createElement('button');
                        cancelButton.classList.add('answerDivButton');
                        cancelButton.innerHTML = 'Cancel';
                        cancelButton.onclick = function() {
                            answerDiv.remove();
                        }
                        answerDivBottomRight.appendChild(cancelButton);

                        var answerDivButton = document.createElement('button');
                        answerDivButton.classList.add('answerDivButton');
                        answerDivButton.innerHTML = 'Answer';
                        answerDivBottomRight.appendChild(answerDivButton);

                        answerDiv.appendChild(answerDivBottomRight);

                        mouseOverStuff.answerDiv = answerDiv;
                        mouseOverStuff.questionDiv = this;
                        insertAfter(answerDiv, this);
                    }

                    byTopic[topic].push(div);
                }
            }
        }
        var dict;
        var reverse = false;
        if (sort === 'byDate') {
            dict = byDate;
            reverse = true;
        } else if (sort === 'byTopic' || sort === undefined || sort === null) {
            dict = byDate;
        }
        var keys = Object.keys(dict);
        keys.sort();
        if (reverse)
            keys.reverse();
        for (var key of keys) {
            for (var div of Object.values(dict[key])) {
                document.getElementById('questionPanel').appendChild(div);
            }
        }
        document.getElementById('refreshGraphic').classList.remove('rotate');
    })
}

refresh();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user.uid);
        document.getElementById("askQuestionButton").onclick = function() {
            var data = {
                question: document.getElementById("questionIn").value,
                topic: Select.selected.replaceAll('#', '__sharp__'),
                description: document.getElementById('descriptionIn').value
            }
            socket.emit('askQuestion', user.uid, data);
            document.getElementById('askQuestionPopup').style.display = 'none';
        }
    }
})

var sortChildren = document.getElementById('sortPanel').children;
for (var selectButton of sortChildren) {
    selectButton.onclick = function(e) {
        e.preventDefault();
        for (var s of sortChildren) {
            s.classList.remove('buttonSelectSelected');
        }
        this.classList.add('buttonSelectSelected');
        sortType = 'by' + this.textContent;
        refresh();
    }
}