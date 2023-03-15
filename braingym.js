let roundStartTime;
let roundInProgress = false;
let problemsCompleted = 0;
let problemStartTime;
let timerInterval;
let feedbackTimeout;

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

function updateTimer() {
  const currentTime = Date.now();
  const timeTaken = (currentTime - problemStartTime) / 1000;
  document.getElementById("time-taken").textContent = timeTaken.toFixed(2);
}

function generateNewProblem() {
  const num1 = Math.floor(Math.random() * 100) + 1;
  const num2 = Math.floor(Math.random() * 100) + 1;
  document.getElementById("question").textContent = `${num1} x ${num2}`;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("hint-box").style.display = "none"; // Hide the hint box  
  problemStartTime = Date.now();

  clearTimeout(feedbackTimeout);
  feedbackTimeout = setTimeout(showHint, 5000);

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 100);  
}

function showHint() {
  const problem = document.getElementById("question").textContent.split(" x ");
  const num1 = parseInt(problem[0], 10);
  const num2 = parseInt(problem[1], 10);

  fetch('https://braingym-backend.onrender.com/api/get_multiplication_tip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      num1: num1,
      num2: num2,
    }),
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("feedback").textContent = data.tip;
    document.getElementById("hint-box").style.display = 'block';
  })
  .catch(error => {
    console.error('Error fetching multiplication tip:', error);
  });
}


function checkAnswer() {
  const problem = document.getElementById("question").textContent.split(" x ");
  const num1 = parseInt(problem[0], 10);
  const num2 = parseInt(problem[1], 10);
  const correctAnswer = num1 * num2;
  const userAnswer = parseInt(document.getElementById("answer").value, 10);

  if (userAnswer === correctAnswer) {
    problemsCompleted++;
    clearTimeout(feedbackTimeout);
    document.getElementById("feedback").textContent = "";
    if (problemsCompleted < 5) {
      generateNewProblem();
    } else {
      roundInProgress = false;
      problemsCompleted = 0;
      const roundEndTime = Date.now();
      const roundTime = (roundEndTime - roundStartTime) / 1000;
      document.getElementById("roundTime").textContent = roundTime.toFixed(2) + " s";
      const listItem = document.createElement("li");
      listItem.textContent = "Round time: " + roundTime.toFixed(2) + " s";
      document.getElementById("timeHistory").appendChild(listItem);
    }
  } else {
    document.getElementById("feedback").textContent = "Incorrect! Try again.";
    showHint();
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
