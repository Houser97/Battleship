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

const gameboardPlayer1 = (() => {
  const boardsize = 10;
  const numberOfShips = 10;
  const ships = [];

  function generateShip(lengthShip) {
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
    for (let i = 0; i < currentNumberOfShips + 1; i += 1) {
      const ship = ships[i];
      for (let j = 0; j < locations.length; j += 1) {
        if (ship.coordinates.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }

  const generateShipLocations = () => {
    let locations;
    for (let i = 0; i < numberOfShips; i += 1) {
      let lengthShip;
      if (i < 3) lengthShip = 3;
      if (i >= 3 && i < 7) lengthShip = 2;
      if (i >= 7 && i <= 9) lengthShip = 1;
      // eslint-disable-next-line prefer-const
      let ship = shipFactory([], lengthShip);
      ships.push(ship);
      do {
        locations = generateShip(lengthShip);
      } while (collision(locations, i));
      ships[i].coordinates = locations;
    }
  };

  return { generateShipLocations, ships };
})();

module.exports = { shipFactory, gameboardPlayer1 };
