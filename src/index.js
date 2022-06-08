import "./style.css";

let currentTurn = "player1";

const DOM = ((doc) => {
  const gameboard2 = doc.querySelector(".grid-player.player2");
  const player1Plays = (gameboardPlayer2) => gameboard2.addEventListener("click", (e) => gameboardPlayer2.receiveAttack(e, "player1", "player2"));
  return { player1Plays };
})(document);

const shipFactory = (coordinates, length) => {
  let currentHealth = length;
  const hitArray = [];
  const hit = (coordinate) => {
    if (hitArray.includes(coordinate)) {
      return `grid${coordinate} already hit`;
    }
    if (coordinates.includes(coordinate)) {
      currentHealth -= 1;
      hitArray.push(coordinate);
      return `hit grid${coordinate}`;
    }
    return "no hit";
  };
  const isSunk = () => {
    if (currentHealth === 0) return "sunk";
    return "no sunk";
  };
  return { hit, isSunk, coordinates };
};

const gameboardFactory = () => {
  const boardsize = 10;
  const numberOfShips = 10;
  /* const spaceLocations = []; */
  const ships = [];

  function checkIfRepeatTurn(grid, currentPlayer, nextPlayer) {
    if (grid.getAttribute("data-ship-number") === null && grid.className.includes("empty")) {
      currentTurn = currentPlayer;
    } if (!(grid.getAttribute("data-ship-number") === null) && grid.className.includes("hit")) {
      currentTurn = currentPlayer;
    }
    currentTurn = nextPlayer;
  }

  function generateShipLocations(lengthShip) {
    const direction = Math.floor(Math.random() * 2);
    let col;
    let row;
    if (direction === 1) {
      row = Math.floor(Math.random() * boardsize);
      col = Math.floor(Math.random() * (boardsize - (lengthShip + 1)));
    } else {
      row = Math.floor(Math.random() * (boardsize - (lengthShip + 1)));
      col = Math.floor(Math.random() * boardsize);
    }

    const newShipLocations = [];
    for (let i = 0; i < lengthShip; i += 1) {
      if (direction === 1) {
        newShipLocations.push(parseInt(`${row}${col + i}`, 10));
      } else {
        newShipLocations.push(parseInt(`${row + i}${col}`, 10));
      }
    }
    return newShipLocations;
  }

  /* function spaceBetweenShips(locations, direction) {
    const invalidValuesUpLeft = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90,
      1, 2, 3, 4, 5, 6, 7, 8, 9];
    const invalidValuesBelowRight = [9, 19, 29, 39, 49, 59, 69, 79, 89, 90, 91,
      92, 93, 94, 95, 96, 97, 98, 99];
    if (locations.length === 1) {
      const centralValue = locations[0];
      const spaceAbove = centralValue - 10;
      const spaceBelow = centralValue + 10;
      const spaceRight = centralValue + 1;
      const spaceLeft = centralValue - 1;

      return [spaceAbove, spaceBelow];
    }

    return [];
  } */

  function collision(locations, currentNumberOfShips) {
    for (let i = 0; i <= currentNumberOfShips; i += 1) {
      const ship = ships[i];
      for (let j = 0; j < locations.length; j += 1) {
        if (ship.coordinates.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
      /* for (let k = 0; k < spaceLocations.length; k += 1) {
        if (ship.coordinates.includes(spaceLocations[k])) {
          return true;
        }
      } */
    }
    /* const extraInvalidLocations = spaceBetweenShips(locations, direction);
    extraInvalidLocations.forEach((spaceLocation) => spaceLocations.push(spaceLocation)); */
    return false;
  }

  const generateShips = () => {
    let locations;
    let direction;
    for (let i = 0; i < numberOfShips; i += 1) {
      let lengthShip;
      if (i < 3) lengthShip = 3;
      if (i >= 3 && i < 7) lengthShip = 2;
      if (i >= 7 && i <= 9) lengthShip = 1;
      const ship = shipFactory([], lengthShip);
      ships.push(ship);
      do {
        locations = generateShipLocations(lengthShip);
      } while (collision(locations, i, direction));
      ships[i].coordinates = locations;
    }
  };

  const receiveAttack = (e, currentPlayer, nextPlayer) => {
    if (typeof e === "object") {
      // eslint-disable-next-line no-use-before-define
      view.displayMiss(e.target);
      // eslint-disable-next-line no-use-before-define
      view.displayHit(e.target);
      return checkIfRepeatTurn(e.target, currentPlayer, nextPlayer);
    }
    const machineSelectedGrid = document.querySelector(`.player1 .grid${e}`);
    // eslint-disable-next-line no-use-before-define
    view.displayHit(machineSelectedGrid);
    // eslint-disable-next-line no-use-before-define
    view.displayMiss(machineSelectedGrid);
    return checkIfRepeatTurn(machineSelectedGrid, currentPlayer, nextPlayer);
  };
  return {
    generateShips, ships, receiveAttack,
  };
};

const view = ((doc) => {
  const showShips = (player, numberOfShips, ships) => {
    for (let i = 0; i < numberOfShips; i += 1) {
      const currentCoordinates = ships[i].coordinates;
      /* console.log(currentCoordinates); */
      const currentGrids = [];
      currentCoordinates.forEach((grid) => {
        const className = doc.querySelector(`.${player} .grid${grid}`);
        className.classList.add("ship");
        className.dataset.shipNumber = `${i}`;
        currentGrids.push(className);
      });
    }
  };

  const displayMiss = (grid) => {
    if (grid.getAttribute("data-ship-number") === null && !(grid.className.includes("empty"))
    && !(grid.className.includes("hit"))) {
      grid.classList.add("empty");
    }
  };

  const displayHit = (grid) => {
    if (!(grid.getAttribute("data-ship-number") === null) && !(grid.className.includes("hit"))) {
      grid.classList.add("hit");
    }
  };
  return { showShips, displayMiss, displayHit };
})(document);

const playerFactory = () => {
  function computerChoice() {
    const boardsize = 10;
    const row = Math.floor(Math.random() * boardsize);
    const col = Math.floor(Math.random() * boardsize);
    return `${row}${col}`;
  }

  const attack = (playerAttacked, gameboardPlayer2) => {
    if (playerAttacked === "player2") {
      return DOM.player1Plays(gameboardPlayer2);
    }
    return parseInt(computerChoice(), 10);
    /* gameboardPlayer1.receiveAttack(computerAttacked); */
  };
  return { attack };
};

// eslint-disable-next-line no-unused-vars
const gameFlow = (() => {
  const gameboardPlayer1 = gameboardFactory();
  const gameboardPlayer2 = gameboardFactory();

  gameboardPlayer1.generateShips();
  gameboardPlayer2.generateShips();

  view.showShips("player1", 10, gameboardPlayer1.ships);
  view.showShips("player2", 10, gameboardPlayer2.ships);

  const player1 = playerFactory();
  const player2 = playerFactory();

  let then = Date.now();
  let now;

  function gameLoop() {
    now = Date.now();
    const difference = now - then;
    if (difference > 1000) {
      console.log(currentTurn);
      if (currentTurn === "player1") {
        player1.attack("player2", gameboardPlayer2);
      }
      if (currentTurn === "player2") {
        const computerChoice = player2.attack("player1");
        gameboardPlayer1.receiveAttack(computerChoice, "player2", "player1");
      }
      then = now;
    }
    window.requestAnimationFrame(gameLoop);
  }

  gameLoop();

  return { };
})();
