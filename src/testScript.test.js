const index = require("./testScript");

describe("Scope for ship 1", () => {
  const ship1 = new index.Ship(2);
  test("check if ship was hit", () => {
    expect(ship1.hit(13)).toBe("hit grid13");
  });

  test("check if ship is no sunk", () => {
    expect(ship1.isSunk()).toBe("no sunk");
  });
});

describe("Scope for ship 2", () => {
  const ship2 = new index.Ship(1);
  ship2.hit(1);
  test("check if ship is sunk", () => {
    expect(ship2.isSunk()).toBe("sunk");
  });
});
