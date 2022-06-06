const index = require("./testScript");

describe("Scope for ship 1", () => {
  const ship1 = index.shipFactory([2, 3, 4], 3);
  test("check that ship was hit", () => {
    expect(ship1.hit(4)).toBe("hit grid4");
  });

  test("check that coordenate was already hit", () => {
    expect(ship1.hit(4)).toBe("grid4 already hit");
  });

  test("check that ship was not hit", () => {
    expect(ship1.hit(10)).toBe("no hit");
  });

  test("check if ship is no sunk", () => {
    expect(ship1.isSunk()).toBe("no sunk");
  });
});

describe("Scope for ship 2", () => {
  const ship2 = index.shipFactory([10], 1);
  test("check that ship was hit", () => {
    expect(ship2.hit(10)).toBe("hit grid10");
  });
  test("check if ship is sunk", () => {
    expect(ship2.isSunk()).toBe("sunk");
  });
});

describe("Scope for player 1 gameboard", () => {
  test("ship array must have length of 10", () => {
    index.gameboardPlayer1.generateShipLocations();
    expect(index.gameboardPlayer1.ships.length).toBe(10);
  });
  test("First ship array's element must have length of 3", () => {
    index.gameboardPlayer1.generateShipLocations();
    expect(index.gameboardPlayer1.ships[0].coordinates.length).toBe(3);
  });
  test("Middle ship array's element must have length of 2", () => {
    index.gameboardPlayer1.generateShipLocations();
    expect(index.gameboardPlayer1.ships[4].coordinates.length).toBe(2);
  });
  test("Middle ship array's element must have length of 1", () => {
    index.gameboardPlayer1.generateShipLocations();
    expect(index.gameboardPlayer1.ships[9].coordinates.length).toBe(1);
  });
});
