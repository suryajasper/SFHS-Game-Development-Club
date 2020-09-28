initializeFirebase();

var socket = io();

var userID;

var sortType = 'byTopic';

String.prototype.replaceAll = function(orig, toReplace) {
    var newString = this;
    while (newString !== newString.replace(orig, toReplace)) {
        newString = newString.replace(orig, toReplace);
    }
    return newString;
}

function URLify(string) {
    var urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
    if (urls) {
        urls.forEach(function(url) {
            string = string.replace(url, '<a target="_blank" href="' + url + '">' + url + "</a>");
        });
    }
    return string.replace("(", "<br/>(");
}


document.getElementById('askQuestion').onclick = function() {
    document.getElementById('askQuestionPopup').style.display = 'block';
}

document.getElementById('cancelAskQuestion').onclick = function() {
    document.getElementById('askQuestionPopup').style.display = 'none';
}

document.getElementById('reverseButton').onclick = function() {
    refresh(true);
}

document.getElementById('hideUpdates').onclick = function() {
    var questionList = document.getElementsByClassName('questionsList')[0];
    var notList = document.getElementsByClassName('notificationsList')[0];
    if (questionList.classList.contains('hidden')) {
        questionList.classList.remove('hidden');
        notList.classList.remove('hidden');
        document.getElementById('hideUpdates').src = 'resources/images/sidebarIcon.svg';
    } else {
        questionList.classList.add('hidden');
        notList.classList.add('hidden');
        document.getElementById('hideUpdates').src = 'resources/images/sidebarIconHidden.svg';
    }
}

function refresh(reverse) {
    document.getElementById('refreshGraphic').classList.add('rotate');
    $('#questionPanel').empty();
    addQuestions(sortType, reverse);
}

document.getElementById('refresh').onclick = refresh;

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

var mouseOverStuff = { answerDiv: null, questionDiv: null };

function parseQuestionRes(res) {
    var byDate = {};
    var byTopic = {};
    var all = [];
    for (var topic of Object.keys(res)) {
        byTopic[topic] = [];
        for (var date of Object.keys(res[topic]))(function(date) {
            var question = res[topic][date];
            var div = document.createElement('div');
            div.classList.add('questionBlock');
            var dateObj = new Date(parseInt(date));
            div.innerHTML = '<div class = "questionBlockInner"><p class = "questionBlockQuestion">' + question.question + '</p>' +
                '<p class = "questionBlockTopic">' + question.topic.replaceAll('__sharp__', '#') + '</p>' +
                '<p class = "questionBlockDate">' + dateObj.toLocaleDateString() + ' @ ' + dateObj.toLocaleTimeString() + '</p>' +
                '<p class = "questionBlockDescription">' + URLify(question.description) + '</p></div>';

            if (date in byDate) byDate[date].push(div);
            else byDate[date] = [div];

            div.onclick = function() {
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
                answerDivButton.onclick = function() {
                    socket.emit('answerQuestion', userID, date, URLify(answerDivInput.value));
                    answerDiv.remove();
                }
                answerDivBottomRight.appendChild(answerDivButton);

                answerDiv.appendChild(answerDivBottomRight);

                mouseOverStuff.answerDiv = answerDiv;
                mouseOverStuff.questionDiv = this;
                insertAfter(answerDiv, this);
            }

            byTopic[topic].push(div);
            all.push(div);
        })(date);
    }
    return { byDate: byDate, byTopic: byTopic, all: all };
}

function parseQuestionResUnanswered(res) {
    for (var date of Object.keys(res))(function(date) {
        var question = res[date];
        var div = document.createElement('div');
        div.classList.add('questionBlock');
        div.classList.add('questionBlockAnswered');
        var dateObj = new Date(parseInt(date));
        div.innerHTML = '<div class = "questionBlockInner"><p class = "questionBlockQuestion">' + question.question + '<span style = "color: #6a0c0c"><b> (ANSWERED)</b></span></p>' +
            '<p class = "questionBlockTopic">' + question.topic.replaceAll('__sharp__', '#') + '</p>' +
            '<p class = "questionBlockDate">' + dateObj.toLocaleDateString() + ' @ ' + dateObj.toLocaleTimeString() + '</p>' +
            '<p class = "questionBlockDescription">' + URLify(question.description) + '</p></div>';

        div.onclick = function() {
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
            answerDivButton.onclick = function() {
                socket.emit('answerQuestion', userID, date, URLify(answerDivInput.value));
                answerDiv.remove();
            }
            answerDivBottomRight.appendChild(answerDivButton);

            answerDiv.appendChild(answerDivBottomRight);

            mouseOverStuff.answerDiv = answerDiv;
            mouseOverStuff.questionDiv = this;
            insertAfter(answerDiv, this);
        }

        document.getElementById('questionPanel').appendChild(div);

        for (var answer of Object.values(question.answers)) {
            //for (var i = 0; i < 5; i++) {
            div.style.marginBottom = '0px';
            var divAnswer = document.createElement('div');
            divAnswer.classList.add('answerDivAnswer');
            var answerText = answer.answer;
            if (answer.byAdmin) {
                divAnswer.classList.add('answerDivAnswerByAdmin');
            }
            if ('answerName' in answer) {
                answerText = '<span class = "answerDivName ' + (answer.byAdmin ? 'answerDivNameAdmin' : '') + '">' + answer.answerName + '</span> ' + answer.answer;
            }
            divAnswer.innerHTML = answerText;
            insertAfter(divAnswer, div);
            //}
        }
    })(date);
}

function addQuestions(sort, reverseSort) {
    socket.emit('getQuestions');
    socket.on('questionsRes', function(raw_res) {
        if (raw_res !== null) {
            var unanswered = raw_res.unanswered;
            $('#questionPanel').empty();

            var sorted = parseQuestionRes(unanswered);

            var dict;
            var reverse = false;
            if (sort === 'byDate') {
                dict = sorted.byDate;
                reverse = true;
            } else if (sort === 'byTopic' || sort === undefined || sort === null) {
                dict = sorted.byTopic;
            }
            if (reverseSort) {
                reverse = !reverse;
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

            if (raw_res.answered) {
                var line = document.createElement('h2');
                line.innerHTML = 'Answered';
                document.getElementById('questionPanel').appendChild(line);
                parseQuestionResUnanswered(raw_res.answered);
            }
        }
        document.getElementById('refreshGraphic').classList.remove('rotate');
    })
}

refresh();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userID = user.uid;
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
    } else {
        window.location.href = '/signup.html';
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

socket.on('refresh', function() {
    refresh();
})