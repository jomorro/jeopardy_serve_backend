const gameParent = document.getElementById("jeopardy-game-container");
//const jeopardyBoard = new JeopardyGrid(gameParent);

let firstRowValue = 100;
let points = 0;
updatePoints();
const grid = generateJeopardy(gameParent, [21, 508, 561, 420, 37, 1195], firstRowValue);

document.getElementById("round-selector").addEventListener('change', (event) => {
    firstRowValue = Number(document.getElementById("round-selector").value);
    generateJeopardy(gameParent, [21, 508, 561, 420, 37, 1195], firstRowValue);
});

document.getElementById("check-answer-button").addEventListener('click', () => {
    const questionNodeReference = document.getElementsByClassName("grid")[0].lastChild;
    if (!questionNodeReference.classList.contains("question-cell")) {
        return;
    } 
    const trueAnswer = questionNodeReference.cellInstance.questionObject.answer.toLowerCase();
    const answerTextField = document.getElementById("answer-text");
    const userAnswer = answerTextField.value.toLowerCase();
    answerTextField.value = "";
    
    questionNodeReference.cellInstance.handleClick();
    if (userAnswer == trueAnswer) {
        points += questionNodeReference.cellInstance.questionObject.value;
        updatePoints();
        console.log("Correct!");
    }
});

function updatePoints() {
    const pointsNode = document.getElementById("points");
    pointsNode.innerText = "Points: " + points;
}