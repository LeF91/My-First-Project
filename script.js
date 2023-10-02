document.addEventListener("DOMContentLoaded", function () {
  const welcome = document.getElementById("Welcome");
  const startButton = document.getElementById("start");
  const gameDiv = document.getElementById("game");
  const board = document.getElementById("board");
  const message = document.getElementById("message");
  const scoreSpan = document.getElementById("score");
  const livesSpan = document.getElementById("lives");

  let game = null;
  let predefinedPath = [];
  let step = 0;
  let gameInProgress = false;
  let score = 0;
  let lives = 3;
  let dispalyTime = 4000;
  let pathLength = 5;

  for (let i = 0; i < 25; i++) {
    const squareDiv = document.createElement("div");
    squareDiv.classList.add("square");
    board.appendChild(squareDiv);
    squareDiv.addEventListener("click", () => checkClick(i));
  }

  function checkClick(index) {
    if (!gameInProgress) return;

    if (index === predefinedPath[step]) {
      step++;
      if (step === predefinedPath.length) {
        score++;
        scoreSpan.textContent = score;
        message.textContent = "Congratulations! You have the One Piece!";
        //speak(""); ajouter la voix luffy
        gameInProgress = false;
        setTimeout(() => {
          pathLength++;
          dispalyTime = 4000;
          livesSpan.textContent = lives;
          startGame();
        }, 1000);
      }
    } else {
      lives--;
      livesSpan.textContent = lives;
      message.textContent = "You lose a life.";
      //speak(""); ajouter la voix de Zoro
      if (lives === 0) {
        message.textContent = "You lost! Go to Impel Down!";
        // speak
        gameInProgress = false;
        welcome.style.display = "block";
        gameDiv.style.display = "none";
        score = 0;
        lives = 3;
        scoreSpan.textContent = score;
        livesSpan.textContent = lives;
        pathLength = 5;
      }
    }
  }

  startButton.addEventListener("click", () => {
    welcome.style.display = "none";
    gameDiv.style.display = "block";
    startGame();
  });

  function startGame() {
    step = 0;
    message.textContent = "";
    gameInProgress = true;
    predefinedPath = generatePath(pathLength);
    // speak ("Let's start the game ")
    playPath();
  }

  function generatePath(length) {
    const newPath = [];
    for (let i = 0; i < length; i++) {
      newPath.push(Math.floor(Math.random() * 25));
    }
    return newPath;
  }

  function playPath() {
    let stepIndex = 0;
    const interval = setInterval(() => {
      const index = predefinedPath[stepIndex];
      const squareDiv = document.querySelector(
        ".square:nth-child(" + (index + 1) + ")"
      );
      squareDiv.style.backgroundColor = "green";
      speak("Square " + (stepIndex + 1));
      setTimeout(() => {
        squareDiv.style.backgroundColor = "lightgray";
      }, dispalyTime / pathLength);
      stepIndex++;

      if (stepIndex === predefinedPath.length) {
        clearInterval(interval);
      }
    }, dispalyTime / pathLength);
  }
});
