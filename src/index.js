import "./style.css";

const DOM = ((doc) => {
  const gameboard2 = doc.querySelector(".grid-player.player2");
  const player1Plays = (gameboardPlayer2) => gameboard2.addEventListener("click", (e) => {
    // eslint-disable-next-line no-use-before-define
    if (gameFlow.currentTurn === "player1") {
      gameboardPlayer2.receiveAttack(e, "player1", "player2");
    }
  });
  return { player1Plays };
})(document);

const shipFactory = (coordinates, lengthShip) => {
  const currentHealth = lengthShip;
  const hit = (shipCoordinates, coordinate, health) => {
    let shipsHealth = health;
    if (shipCoordinates.includes(coordinate)) {
      shipsHealth -= 1;
      return shipsHealth;
    }
    return shipsHealth;
  };
  const isSunk = (health) => {
    if (health === 0) return "sunk";
    return "no sunk";
  };
  return {
    hit,
    isSunk,
    currentHealth,
    coordinates,
  };
};

const view = ((doc) => {
  const showShips = (player, numberOfShips, ships) => {
    for (let i = 0; i < numberOfShips; i += 1) {
      const currentCoordinates = ships[i].coordinates;
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

const gameboardFactory = () => {
  const boardsize = 10;
  const numberOfShips = 10;
  const ships = [];

  function extractGridNumber(grid) {
    if (grid.classList[0].length === 5) {
      return grid.classList[0].substr(-1);
    }
    return grid.classList[0].substr(-2);
  }

  function getShipAttacked(grid) {
    if (grid.getAttribute("data-ship-number") !== null) {
      return parseInt(grid.getAttribute("data-ship-number"), 10);
    }
    return "no ship has been attacked";
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

  function collision(locations, currentNumberOfShips) {
    for (let i = 0; i <= currentNumberOfShips; i += 1) {
      const ship = ships[i];
      for (let j = 0; j < locations.length; j += 1) {
        if (ship.coordinates.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }

  const generateShips = () => {
    let locations;
    for (let i = 0; i < numberOfShips; i += 1) {
      let lengthShip;
      if (i < 3) lengthShip = 3;
      if (i >= 3 && i < 7) lengthShip = 2;
      if (i >= 7 && i <= 9) lengthShip = 1;
      const ship = shipFactory([], lengthShip);
      ships.push(ship);
      do {
        locations = generateShipLocations(lengthShip);
      } while (collision(locations, i));
      ships[i].coordinates = locations;
    }
  };

  const receiveAttack = (e, currentPlayer, nextPlayer) => {
    let attackedCoordinates;
    let shipAttacked = "no ship has been attacked";
    if (typeof e === "object") {
      attackedCoordinates = extractGridNumber(e.target);
      shipAttacked = getShipAttacked(e.target);
      // eslint-disable-next-line no-use-before-define
      gameFlow.setNextTurn(e.target, currentPlayer, nextPlayer, attackedCoordinates, shipAttacked);
    } else {
      const machineSelectedGrid = document.querySelector(`.player1 .grid${e}`);
      attackedCoordinates = extractGridNumber(machineSelectedGrid);
      shipAttacked = getShipAttacked(machineSelectedGrid);
      // eslint-disable-next-line no-use-before-define
      gameFlow.setNextTurn(
        machineSelectedGrid,
        currentPlayer,
        nextPlayer,
        attackedCoordinates,
        shipAttacked,
      );
    }
  };
  return {
    generateShips, ships, receiveAttack,
  };
};

const playerFactory = () => {
  function computerChoice() {
    const boardsize = 10;
    const row = Math.floor(Math.random() * boardsize);
    const col = Math.floor(Math.random() * boardsize);
    return `${row}${col}`;
  }

  const attack = (playerAttacked, gameboardPlayer2) => {
    if (playerAttacked === "player2") {
      DOM.player1Plays(gameboardPlayer2);
    }
    return parseInt(computerChoice(), 10);
    /* gameboardPlayer1.receiveAttack(computerAttacked); */
  };
  return { attack };
};

const gameFlow = (() => {
  let currentTurn = "player1";
  let shipHit = 0;
  const gameboardPlayer1 = gameboardFactory();
  const gameboardPlayer2 = gameboardFactory();

  gameboardPlayer1.generateShips();
  gameboardPlayer2.generateShips();

  view.showShips("player1", 10, gameboardPlayer1.ships);
  view.showShips("player2", 10, gameboardPlayer2.ships);

  const player1 = playerFactory();
  const player2 = playerFactory();
  player1.attack("player2", gameboardPlayer2);

  const setNextTurn = (grid, currentPlayer, nextPlayer, attackedCoordinates, shipAttacked) => {
    if (grid.className.includes("empty") || grid.className.includes("hit")) {
      currentTurn = currentPlayer;
    } else if (!(grid.className.includes("empty")) && !(grid.className.includes("hit"))) {
      // eslint-disable-next-line no-use-before-define
      view.displayMiss(grid);
      // eslint-disable-next-line no-use-before-define
      view.displayHit(grid);
      /* Llamar a hit e isSunk del respectivo barco */
      if (grid.className.includes("hit")) {
        if (currentTurn === "player1") {
          shipHit = gameboardPlayer2.ships[shipAttacked];
          const attackCoordinates = parseInt(attackedCoordinates, 10);

          shipHit.currentHealth = shipHit.hit(
            shipHit.coordinates,
            attackCoordinates,
            shipHit.currentHealth,
          );

          if (shipHit.isSunk(shipHit.currentHealth) === "sunk") {
            shipHit.coordinates.forEach((shipSunk) => {
              const gridAttacked = document.querySelector(`.player2 .grid${shipSunk}`);
              gridAttacked.classList.add("sunk");
            });
          }
        } else if (currentTurn === "player2") {
          shipHit = gameboardPlayer1.ships[shipAttacked];
          const attackCoordinates = parseInt(attackedCoordinates, 10);

          shipHit.currentHealth = shipHit.hit(
            shipHit.coordinates,
            attackCoordinates,
            shipHit.currentHealth,
          );

          if (shipHit.isSunk(shipHit.currentHealth) === "sunk") {
            shipHit.coordinates.forEach((shipSunk) => {
              const gridAttacked = document.querySelector(`.player1 .grid${shipSunk}`);
              gridAttacked.classList.add("sunk");
            });
          }
        }
        currentTurn = currentPlayer;
      } else { currentTurn = nextPlayer; }
    }
  };

  let then = Date.now();
  let now;

  function gameLoop() {
    now = Date.now();
    const difference = now - then;
    if (difference > 1000 / 60) {
      if (currentTurn === "player2") {
        const computerChoice = player2.attack("player1");
        gameboardPlayer1.receiveAttack(computerChoice, "player2", "player1");
      }
      then = now;
    }
    window.requestAnimationFrame(gameLoop);
  }

  gameLoop();

  return { currentTurn, setNextTurn };
})();
