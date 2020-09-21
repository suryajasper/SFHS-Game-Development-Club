initializeFirebase();

var socket = io();

document.getElementById('askQuestion').onclick = function() {
    document.getElementById('askQuestionPopup').style.display = 'block';
}

document.getElementById('cancelAskQuestion').onclick = function() {
    document.getElementById('askQuestionPopup').style.display = 'none';
}

socket.emit('getQuestions');
socket.on('questionsRes', function(res) {
    if (res !== null) {
        for (var topic of Object.keys(res)) {
            for (var date of Object.keys(res[topic])) {
                var question = res[topic][date];
                var div = document.createElement('div');
                div.classList.add('questionBlock');
                div.innerHTML = '<div class = "questionBlockInner"><p class = "questionBlockQuestion">' + question.question + '</p><p class = "questionBlockTopic">' + question.topic.replaceAll('__sharp__', '#') + '</p><p class = "questionBlockDescription">' + question.description + '</p></div>';
                document.getElementById('questionPanel').appendChild(div);
            }
        }
    }
})

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