document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const shuffleButton = document.getElementById("shuffle");
  const imageSelect = document.getElementById("image-select");
  const timerDisplay = document.getElementById("timer");
  const movesDisplay = document.getElementById("moves");
  const pauseButton = document.getElementById("pause");
  const overlay = document.querySelector(".overlay");
  const backgroundMusic = document.getElementById("background-music"); // Get the audio element

  let tiles = [];
  let timerInterval;
  let secondsElapsed = 0;
  let moveCount = 0;
  let isPaused = false;
  let solvedState = [...Array(15).keys()].map(x => x + 1).concat(""); // Solved state [1, 2, 3, ..., 15, ""]
  
  function initializeGame() {
    tiles = [...solvedState]; // Reset to solved state
    renderTiles();
    resetTimer();
    resetMoves();
    playMusic(); // Start playing music when the game starts
  }

  function shuffleTiles() {
    if (isPaused) return;
    tiles = shuffle([...tiles]);
    renderTiles();
    resetTimer();
    resetMoves();
    startTimer();
    playMusic(); // Start playing music when the game starts
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

      if (tiles[i] !== "") {
        tileElement.style.backgroundImage = `url('img/${currentImageSet}/${currentImageSet}${tiles[i]}.jpg')`;
        tileElement.style.backgroundSize = "cover";
        tileElement.style.backgroundPosition = "center";
      } else {
        tileElement.classList.add("empty"); 
      }

      tileElement.addEventListener("click", () => {
        if (isPaused || tiles[i] === "") return; 

        const emptyTileIndex = tiles.indexOf(""); 
        const validMoves = getValidMoves(emptyTileIndex); 

        if (validMoves.includes(i)) {
          [tiles[emptyTileIndex], tiles[i]] = [tiles[i], tiles[emptyTileIndex]];
          moveCount++;
          movesDisplay.textContent = `Moves: ${moveCount}`;
          renderTiles(); 
          checkPuzzleSolved(); 
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

      if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
        validMoves.push(newIndex);
      }
    }

    return validMoves;
  }

  function checkPuzzleSolved() {
    if (JSON.stringify(tiles) === JSON.stringify(solvedState)) {
      stopTimer();
      setTimeout(() => {
        showCongratulatoryMessage();
      }, 500);
    }
  }

  function showCongratulatoryMessage() {
    const modal = document.getElementById("modal"); // Get modal element (already created in HTML)
    const message = document.getElementById("congrats-message");
  
    // Update the message content
    message.textContent = `It took you ${secondsElapsed} seconds and ${moveCount} moves to complete the puzzle!`;
  
    // Show the modal
    modal.style.display = "block"; // Show modal
    
    // Add an event listener to the close button to close the modal
    const closeBtn = modal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none"; // Hide modal
      initializeGame(); // Reset game
    });
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

  function playMusic() {
    backgroundMusic.play(); // Play the background music when the game starts
  }

  function stopMusic() {
    backgroundMusic.pause(); // Pause the background music when the game is paused
    backgroundMusic.currentTime = 0; // Reset the music to start from the beginning
  }

  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    if (isPaused) {
      pauseButton.textContent = "Resume";
      stopTimer();
      stopMusic(); // Stop music when the game is paused
      overlay.style.display = "flex";
      grid.style.pointerEvents = "none"; 
    } else {
      pauseButton.textContent = "Pause";
      startTimer();
      playMusic(); // Play music when the game is resumed
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

