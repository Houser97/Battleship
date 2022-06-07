import "./style.css";

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

  const receiveAttack = (e) => {
    if (e.target.getAttribute("data-ship-number") === null && !(e.target.className.includes("empty"))) {
      e.target.classList.add("empty");
      console.log("Houmser");
    }
  };

  const styleGrid = (player) => {
    for (let i = 0; i < numberOfShips; i += 1) {
      const currentCoordinates = ships[i].coordinates;
      /* console.log(currentCoordinates); */
      const currentGrids = [];
      currentCoordinates.forEach((grid) => {
        const className = document.querySelector(`.${player} .grid${grid}`);
        className.classList.add("ship");
        className.dataset.shipNumber = `${i}`;
        currentGrids.push(className);
      });
    }
  };

  return {
    generateShips, ships, styleGrid, receiveAttack,
  };
};

const gameboardPlayer1 = gameboardFactory();
const gameboardPlayer2 = gameboardFactory();

gameboardPlayer1.generateShips();
gameboardPlayer1.styleGrid("player1");

gameboardPlayer2.generateShips();
gameboardPlayer2.styleGrid("player2");

const playerFactory = () => {
  const attack = (playerAttacked) => {
    const gameboardOpponent = document.querySelector(".grid-player.player2");
    gameboardOpponent.addEventListener("click", (e) => { gameboardPlayer2.receiveAttack(e); });
  };
  return { attack };
};

const player1 = playerFactory();
player1.attack("player2");
