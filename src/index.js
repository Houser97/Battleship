import "./style.css";

// eslint-disable-next-line func-names
const Ship = function (length) {
  this.length = length;
  const hit = (e) => {
    if (e.classList[2] === "grid-playable") {
      return "hit";
    }
    return "no hit";
  };
  return { hit, length };
};

const ship1 = Ship(2);
