document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const shuffleButton = document.getElementById("shuffle");
  const imageSelect = document.getElementById("image-select");
  const timerDisplay = document.getElementById("timer");
  const movesDisplay = document.getElementById("moves");
  const pauseButton = document.getElementById("pause");
  const overlay = document.querySelector(".overlay");

  let tiles = [];
  let timerInterval;
  let secondsElapsed = 0;
  let moveCount = 0;
  let isPaused = false;

  function initializeGame() {
    tiles = Array.from({ length: 15 }, (_, i) => i + 1); // Initialize tiles 1-15
    tiles.push(""); // Add empty tile
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
      [array[i], array[j]] = [array[j], array[i]]; // Shuffle tiles
    }
    return array;
  }

  function renderTiles() {
    grid.innerHTML = ""; // Clear grid before rendering
    const currentImageSet = imageSelect.value;

    for (let i = 0; i < 16; i++) {
      const tileElement = document.createElement("div");
      tileElement.className = "tile";

      const numberOverlay = document.createElement("div");
      numberOverlay.className = "number";

      if (tiles[i] !== "") {
        numberOverlay.textContent = tiles[i];
      }

      tileElement.appendChild(numberOverlay);

      // Set the background image for the tile
      if (tiles[i] !== "") {
        tileElement.style.backgroundImage = `url('img/${currentImageSet}/${currentImageSet}${tiles[i]}.jpg')`;
        tileElement.style.backgroundSize = "cover";
        tileElement.style.backgroundPosition = "center";
      } else {
        tileElement.classList.add("empty"); // Empty tile for the space
      }

      tileElement.addEventListener("click", () => {
        if (isPaused || tiles[i] === "") return; // Don't allow move if paused or on empty tile

        const emptyTileIndex = tiles.indexOf(""); // Find empty tile
        const validMoves = getValidMoves(emptyTileIndex); // Get valid moves based on empty tile position

        if (validMoves.includes(i)) {
          // Swap tiles
          [tiles[emptyTileIndex], tiles[i]] = [tiles[i], tiles[emptyTileIndex]];
          moveCount++;
          movesDisplay.textContent = `Moves: ${moveCount}`;
          renderTiles(); // Re-render the grid with updated tiles
        }
      });

      grid.appendChild(tileElement);
    }
  }

  function getValidMoves(emptyTileIndex) {
    const validMoves = [];
    const row = Math.floor(emptyTileIndex / 4);
    const col = emptyTileIndex % 4;

    // Directions: up, down, left, right
    const directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1],  // right
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      const newIndex = newRow * 4 + newCol;

      // Check if new position is within bounds
      if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
        validMoves.push(newIndex);
      }
    }

    return validMoves;
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
      grid.style.pointerEvents = "none"; // Disable clicks on grid
    } else {
      pauseButton.textContent = "Pause";
      startTimer();
      overlay.style.display = "none";
      grid.style.pointerEvents = "auto"; // Enable clicks on grid
    }
  });

  shuffleButton.addEventListener("click", shuffleTiles);
  imageSelect.addEventListener("change", () => {
    initializeGame(); // Re-initialize game if image set is changed
  });

  initializeGame();
});





