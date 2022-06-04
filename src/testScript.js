// eslint-disable-next-line func-names
const Ship = function (length) {
  this.currentHealth = length;
  const hit = (coordenate) => {
    this.currentHealth -= 1;
    return `hit grid${coordenate}`;
  };
  const isSunk = () => {
    if (this.currentHealth === 0) return "sunk";
    return "no sunk";
  };
  return { hit, isSunk };
};

module.exports = { Ship };
