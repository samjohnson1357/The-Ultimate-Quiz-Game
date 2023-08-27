/*
File Summary: File contains functions that update the HTML DOM as the quiz is being taken.
 */

"use strict";

function getQuizCategorySelectedByUser() {
    return document.getElementById('category-drop-down').value;
}

function getQuizDifficultySelectedByUser() {
    return document.getElementById('difficulty-drop-down').value;
}

function modifyQuestionNumber(questionNumber) {
    $('#question-number').html(`Question ${questionNumber}/10`);
}

function modifyCurrentScore(currentScore) {
    $('#current-score').html(`Current Score: ${currentScore}/10`);
}

function changeQuizElementVisibility(show) {
    let visibility = show === true ? "visible" : "hidden";
    $("#question-number, #current-score, #question, .answer").css("visibility", visibility);
}

function setQuestionFromQuestionObject(questionObj) {
    $('#question').html(questionObj['question']['text']);
}

function getAnswerOptionsFromQuestionObject(questionObj) {
    /*
    The API occasionally returns multiple of the same answer in the incorrectAnswers array. This function remedies
    this problem.

    Another problem is the occasional ending whitespace character, which leads to problems with &nbsp;. We resolve
    this issue by trimming the strings.

    One question where this occurred was "Which Of The Worlds Continents Has The Highest Population?" where the
    answer string "Asia" was returned as "Asia ".
     */
    let answers = questionObj['incorrectAnswers']
    answers.push(questionObj['correctAnswer'])
    answers = removeDuplicatesFromStringArray(answers)
    trimArrayOfStringsInplace(answers)
    return shuffleStringArray(answers)
}

function setAnswersFromQuestionObject(questionObj) {
    let answers = getAnswerOptionsFromQuestionObject(questionObj);
    if (answers.length !== 4) {
        throw new Error("There aren't four answers, as there should be.");
    }
    let answerElements = $('.answer');
    for (let i = 0; i < answers.length; i++) {
        answerElements[i].innerHTML = answers[i];
    }
}

function getCorrectAnswerFromQuestionObject(questionObj) {
    /*
    The trim method call is critical here, as it removes the occasional ending whitespace character,
    which turns into &nbsp; and causes problems.
     */
    return questionObj['correctAnswer'].trim();
}

function setAllElementsFromQuestionObject(questionObj) {
    setQuestionFromQuestionObject(questionObj);
    setAnswersFromQuestionObject(questionObj);
}

function testSendScorePostRequest() {
    /*
    This function exists merely to see if we can successfully send and handle this post request without errors 
    occurring. Do not delete this function.
    */
    sendScorePostRequest('Music', 'Easy', 8)
}

function sendScorePostRequest(category, difficulty, score) {
    /*
    Note that we don't send the username as it isn't available in JavaScript.
    We don't send the current datetime because it can be easily obtained by Python server-side.
    */
    return fetch('/score-post-request/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 
        'X-CSRFToken': getCookie('csrftoken')
    },
        // I've found that JSON.stringify is necessary
        body: JSON.stringify(
            {
            category: category, 
            difficulty: difficulty,
            score: score
        })
    })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function disableBeginQuizButton() {
    document.getElementById('begin-quiz-button').disabled = true
}

function enableBeginQuizButton() {
    document.getElementById('begin-quiz-button').disabled = false
}

async function beginQuiz() {
    /*
    This function connects to the button that starts the quiz and is the main entry point of the program.
     */
    disableBeginQuizButton()

    let nQuestions = 10 // Can be set lower for debugging purposes.
    let category = getQuizCategorySelectedByUser();
    let difficulty = getQuizDifficultySelectedByUser();
    let url = getQuestionsURL(nQuestions, CATEGORIES_MAP[category], DIFFICULTIES_MAP[difficulty]);
    let questions = await fetch(url);
    questions = await questions.json();

    // Initial setup. These actions will need to be taken again.
    let currentQuestionIndex = 0;
    let currentScore = 0;
    setAllElementsFromQuestionObject(questions[currentQuestionIndex]);
    changeQuizElementVisibility(true);
    let correctAnswer = getCorrectAnswerFromQuestionObject(questions[currentQuestionIndex]);
    // Here we must remove the previously linked function (if any), and then add it again.
    // Without this line of code, a new event handler is created everytime the quiz is restarted, causing problems.
    $('.answer').off('click');
    $('.answer').on('click', answerClicked);
    function answerClicked() {
        /*
        Function must be nested to access variables from the outer scope.
         */
        // If the user clicked on the right answer, increment the current score and change the coloring.
        let chosenAnswer = this.innerHTML;
        let [green, red] = getCSSColors(['--green', '--red'])
        if (chosenAnswer === correctAnswer) {
            document.getElementById('correct-answer-sound').play()
            this.style.backgroundColor = green;
            currentScore++;
            modifyCurrentScore(currentScore);
        }
        // If the user clicked on the wrong answer, change the coloring of two answers.
        else {
            document.getElementById('incorrect-answer-sound').play()
            this.style.backgroundColor = red;
            let correctAnswerSearchString = `.answer:contains(${correctAnswer})`;
            $(correctAnswerSearchString).css('backgroundColor', green);
        }

        // Ensure that none of the other questions can be clicked right after this one is clicked.
        $('.answer').off('click');
        setTimeout(setupNextQuestion, 1000); // We want the new colors to remain for a short time.
    }
    function setupNextQuestion() {
        // Make sure answers once again respond to being clicked.
        $('.answer').on('click', answerClicked);

        // First of all, all the colors have to change back to the starting color.
        let darkBlue = getCSSColor('--dark-blue')
        $('.answer').css('backgroundColor', darkBlue);

        // If this was the last question of the quiz, we take certain actions.
        if (currentQuestionIndex === (nQuestions - 1)) {

            // Send the score to the database and then display a modal of the final results.
            sendScorePostRequest(category, difficulty, currentScore).then(
                function(response) {
                    $('#final-score-span-element').html(currentScore)
                    
                    // We display a modal noting that the user's score has been saved.
                    if (response.ok) {
                        // Display a modal of the final score.
                        $('#logged-in-modal-body').css('display', 'block')
                        $('#quiz-score-modal').modal('show')     
                    }
                    // We display a modal noting that the user's score has not been saved.
                    else {
                        $('#not-logged-in-modal-body').css('display', 'block')
                        $('#quiz-score-modal').modal('show')  
                    }
                }
            )
            // Setup the state for the next quiz.
            changeQuizElementVisibility(false)
            modifyQuestionNumber(1)
            modifyCurrentScore(0)
            enableBeginQuizButton()
        }
        // Otherwise, setup the next question and continue the quiz.
        else {
            currentQuestionIndex++;
            setAllElementsFromQuestionObject(questions[currentQuestionIndex]);
            correctAnswer = getCorrectAnswerFromQuestionObject(questions[currentQuestionIndex]);
            modifyQuestionNumber(currentQuestionIndex + 1);
        }
    }
}

