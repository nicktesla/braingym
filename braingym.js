let roundStartTime;
let roundInProgress = false;
let problemsCompleted = 0;
let totalRoundTime = 0;

function roundCountdown() {
  let countdownTime = 5;
  let countdownElement = document.getElementById("countdown");
  countdownElement.textContent = countdownTime;
  let countdownInterval = setInterval(() => {
    countdownTime--;
    countdownElement.textContent = countdownTime;
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "";
      generateNewProblem();
      roundStartTime = Date.now();
    }
  }, 1000);
}

function generateNewProblem() {
  const num1 = Math.floor(Math.random() * 100) + 1;
  const num2 = Math.floor(Math.random() * 100) + 1;
  document.getElementById("question").textContent = `${num1} x ${num2}`;
  document.getElementById("answer").value = "";
}

function checkAnswer() {
  const problem = document.getElementById("question").textContent.split(" x ");
  const num1 = parseInt(problem[0], 10);
  const num2 = parseInt(problem[1], 10);
  const correctAnswer = num1 * num2;
  const userAnswer = parseInt(document.getElementById("answer").value, 10);

  if (userAnswer === correctAnswer) {
    problemsCompleted++;
    if (problemsCompleted < 5) {
      generateNewProblem();
    } else {
      roundInProgress = false;
      problemsCompleted = 0;
      const roundEndTime = Date.now();
      const roundTime = (roundEndTime - roundStartTime) / 1000;
      totalRoundTime += roundTime;
      document.getElementById("roundTime").textContent = roundTime.toFixed(2) + " s";
      document.getElementById("totalTime").textContent = totalRoundTime.toFixed(2) + " s";
      const listItem = document.createElement("li");
      listItem.textContent = "Round time: " + roundTime.toFixed(2) + " s";
      document.getElementById("timeHistory").appendChild(listItem);
    }
  } else {
    alert("Incorrect! Try again.");
  }
}

function startRound() {
  if (!roundInProgress) {
    roundInProgress = true;
    roundCountdown();
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
document.getElementById("answer").addEventListener("keydown", function (event) {
  if (event.key === 'Enter') {
    checkAnswer();
  }
});


  document.getElementById("start").addEventListener("click", function () {
    startRound();
  });
});
