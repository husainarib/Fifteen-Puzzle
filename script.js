document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const shuffleButton = document.getElementById("shuffle");
  let tiles = [];

  // Initialize the game
  function initializeGame() {
    // Create the initial tiles
    tiles = Array.from({ length: 15 }, (_, i) => i + 1);
    renderTiles();
  }

  // Shuffle tiles
  function shuffleTiles() {
    tiles = shuffle([...tiles]);
    renderTiles();
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Render the tiles on the grid
  function renderTiles() {
    grid.innerHTML = "";
    const flatTiles = [...tiles, ""];
    for (let i = 0; i < 16; i++) {
      const tileElement = document.createElement("div");
      tileElement.className = "tile";
      if (flatTiles[i] === "") {
        tileElement.classList.add("empty");
      } else {
        tileElement.textContent = flatTiles[i];
      }
      grid.appendChild(tileElement);
    }
  }

  shuffleButton.addEventListener("click", shuffleTiles);

  // Start the game
  initializeGame();
});
