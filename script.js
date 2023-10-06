import maps from "./data.js";
let currentLevel = 0;
const welcome = document.getElementById("Welcome");
const startButton = document.getElementById("start");
const gameDiv = document.getElementById("game");
const board = document.getElementById("board");
const message = document.getElementById("message");
const scoreSpan = document.getElementById("score");
const endGameElement = document.getElementById("game-end");
const gameContainer = document.getElementById("game-container");
const restart = document.getElementById("restart");
let playerPosition;
const livesSpan = document.getElementById("lives");
let predefinedPath = [];
let step = 0;
let gameInProgress = false;
let score = 0;
let lives = 3;
let displayTime = 4000;
let pathLength = 4;
let boardSize = 5;
let cells = [];
let canMove = false;

function generateBoard(customMap) {
  clearBoard();
  cells = [];
  console.log(customMap);
  for (let i = 0; i < customMap.table.length; i++) {
    const element = customMap.table[i];
    const squareDiv = document.createElement("div");
    squareDiv.classList.add("square");
    if (element > 0) {
      squareDiv.dataset.order = element;
    }
    board.append(squareDiv);
    cells.push(squareDiv);
  }
}

function move(direction) {
  if (!canMove) return;
  const offset = getOffset(direction);
  const nextCell = cells[playerPosition + offset];

  if (!nextCell) return;

  // if (validateMove(nextCell)) {
  //   hidePlayer();
  //   playerPosition = nextCell;
  //   displayPath();
  // }

  // if (nextCell) {
  //   hidePlayer();
  //   playerPosition += offset;
  //   displayPlayer();
  // }

  // checkClick(nextCell);
  if (nextCell.dataset.order) {
    hidePlayer();
    playerPosition += offset;
    displayPlayer();
  } else {
    hidePlayer();
    playerPosition += offset;
    displayPlayer();
    lives--;

    livesSpan.textContent = lives;
    if (lives === 0) {
      endGameElement.classList.remove("hidden");
      gameContainer.style.display = "none";
    }
    message.textContent = " You lose a life!";
    setTimeout(() => {
      message.textContent = "";
    }, 500);
  }

  if (playerPosition === maps[currentLevel].end) {
    console.log("won the gane");
    currentLevel++;
    canMove = false;
    setTimeout(() => {
      startGame();
    }, 500);
  }
}

function getOffset(direction) {
  switch (direction) {
    case "up":
      return -5;
    case "down":
      return +5;
    case "left":
      return -1;
    case "right":
      return 1;
    default:
      return 0;
  }
}

document.addEventListener("keydown", (event) => {
  console.log(event.key, event.code, event.keyCode);
  event.preventDefault();
  switch (event.key) {
    case "ArrowUp":
      move("up");
      return;
    case "ArrowDown":
      move("down");
      return;
    case "ArrowLeft":
      move("left");
      return;
    case "ArrowRight":
      move("right");
      return;
  }
});

// function checkClick(index) {
//   if (!gameInProgress) return;

//   if (index === predefinedPath[step]) {
//     step++;
//     if (step === predefinedPath.length) {
//       score++;
//       scoreSpan.textContent = score;
//       message.textContent = "Congratulations! You have the One Piece!";
//       //speak(""); ajouter la voix luffy//
//       gameInProgress = false;
//       setTimeout(() => {
//         pathLength++;
//         displayTime = 500;
//         livesSpan.textContent = lives;
//         startGame();
//       }, 500);
//     }
//   } else {
//     if (playerPosition !== predefinedPath[step]) {
//       lives--;
//       livesSpan.textContent = lives;
//       message.textContent = "You lose a life.";
//       //speak(""); ajouter la voix de Zoro//
//     }
//     if (lives === 0) {
//       alert("Game Over! Go to Impel Down.");

//       welcome.style.display = "block";
//       gameDiv.style.display = "none";
//       score = 0;
//       lives = 3;
//       scoreSpan.textContent = score;
//       livesSpan.textContent = lives;
//       pathLength = 4;
//     }
//   }
// }

startButton.addEventListener("click", () => {
  welcome.style.display = "none";
  gameDiv.style.display = "block";
  startGame();
});

restart.addEventListener("click", () => {
  location.reload();
});

function startGame() {
  clearBoard();
  if (cells.length === 0) {
    generateBoard(maps[currentLevel]);
  }
  step = 0;
  message.textContent = "";
  gameInProgress = false;
  playerPosition = maps[currentLevel].start;
  predefinedPath = generatePath(pathLength);
  // speak ("Let's start the game ")//
  displayPath();
}

function endGame() {
  gameInProgress = false;

  if (lives > 0) {
    setTimeout(() => {
      currentLevel++;
      if (currentLevel >= Object.keys(maps).length) {
        currentLevel = 0;
      }
      pathLength++;
      displayTime = 500;
      livesSpan.textContent = lives;
      clearBoard();
      startGame();
    }, 1000);
  }
}

function clearBoard() {
  const board = document.getElementById("board");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  cells = [];
}

function generatePath(length) {
  const newPath = [];
  newPath.push(boardSize - 1);
  for (let i = 1; i < length; i++) {
    newPath.push(newPath[i - 1] - 1);
  }
  return newPath;
}

function displayPath(order = 1) {
  const cell = document.querySelector(`[data-order="${order}"]`);
  if (!cell) {
    removeHighlight();
    return;
  }
  cell.classList.add("highlight");
  setTimeout(() => {
    order += 1;
    displayPath(order);
  }, 100);
}
function removeHighlight(order = 1) {
  const cell = document.querySelector(`[data-order="${order}"]`);
  if (!cell) {
    canMove = true;
    displayPlayer();
    return;
  }
  cell.classList.remove("highlight");
  setTimeout(() => {
    order += 1;
    removeHighlight(order);
  }, 100);
}

function hidePlayer() {
  cells[playerPosition].classList.remove("player");
  displayPlayer();
}

function displayPlayer() {
  cells[playerPosition].classList.add("player");
}
//   const interval = setInterval(() => {
//     const index = predefinedPath[stepIndex];
//     const squareDiv = document.querySelector(
//       ".square:nth-child(" + (index + 1) + ")"
//     );
//     squareDiv.style.backgroundColor = "green";
//     //speak("Square " + (stepIndex + 1));//
//     setTimeout(() => {
//       squareDiv.style.backgroundColor = "lightgray";
//     }, displayTime / pathLength);
//     stepIndex++;

//     if (stepIndex === predefinedPath.length) {
//       clearInterval(interval);
//       setTimeout(() => {
//         playPath();
//       }, 1000);
//     }
//   }, displayTime / pathLength);
