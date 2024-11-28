document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const shuffleButton = document.getElementById("shuffle");
  const imageSelect = document.getElementById("image-select");
  const timerDisplay = document.getElementById("timer");
  const movesDisplay = document.getElementById("moves");
  const pauseButton = document.getElementById("pause");
  const overlay = document.querySelector(".overlay"); // Get the overlay from the DOM

  let tiles = [];
  let timerInterval;
  let secondsElapsed = 0;
  let moveCount = 0;
  let isPaused = false;

  function initializeGame() {
    tiles = Array.from({ length: 15 }, (_, i) => i + 1);
    renderTiles();
    resetTimer();
    resetMoves();
  }

  function shuffleTiles() {
    if (isPaused) return;
    tiles = shuffle([...tiles]);
    renderTiles();
    resetTimer();
    resetMoves();
    startTimer();
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderTiles() {
    grid.innerHTML = "";
    const flatTiles = [...tiles, ""];
    const currentImageSet = imageSelect.value;

    for (let i = 0; i < 16; i++) {
      const tileElement = document.createElement("div");
      tileElement.className = "tile";

      if (flatTiles[i] === "") {
        tileElement.classList.add("empty");
      } else {
        tileElement.style.backgroundImage = `url('img/${currentImageSet}/${currentImageSet}${flatTiles[i]}.jpg')`;
        tileElement.style.backgroundSize = "cover";
        tileElement.style.backgroundPosition = "center";
      }

      tileElement.addEventListener("click", () => {
        if (flatTiles[i] !== "" && !isPaused) {
          moveCount++;
          movesDisplay.textContent = `Moves: ${moveCount}`;
        }
      });

      grid.appendChild(tileElement);
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsElapsed++;
      timerDisplay.textContent = `Time: ${secondsElapsed}s`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerDisplay.textContent = "Time: 0s";
  }

  function resetMoves() {
    moveCount = 0;
    movesDisplay.textContent = "Moves: 0";
  }

  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    if (isPaused) {
      pauseButton.textContent = "Resume";
      stopTimer();
      overlay.style.display = "flex"; 
      grid.style.pointerEvents = "none"; 
    } else {
      pauseButton.textContent = "Pause";
      startTimer();
      overlay.style.display = "none"; 
      grid.style.pointerEvents = "auto"; 
    }
  });

  shuffleButton.addEventListener("click", shuffleTiles);
  imageSelect.addEventListener("change", () => {
    initializeGame();
  });

  initializeGame();
});




