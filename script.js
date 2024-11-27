document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const shuffleButton = document.getElementById("shuffle");
  const imageSelect = document.getElementById("image-select");
  let tiles = [];

  let currentImageSet = imageSelect.value;

  function initializeGame() {
    tiles = Array.from({ length: 15 }, (_, i) => i + 1); 
    renderTiles();
  }

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

  function renderTiles() {
    grid.innerHTML = ""; 
    const flatTiles = [...tiles, ""];

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

      grid.appendChild(tileElement);
    }
  }

  // Update the image set when the user selects a different option
  imageSelect.addEventListener("change", (e) => {
    currentImageSet = e.target.value;
    initializeGame();
  });

  shuffleButton.addEventListener("click", shuffleTiles);

  // Initialize the game with the selected image set
  initializeGame();
});


