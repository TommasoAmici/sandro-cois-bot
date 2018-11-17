const randomChoice = choices =>
  choices[Math.floor(Math.random() * choices.length)];

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const splitKeyValues = input => {
  const i = input.indexOf(" ");
  const key = input.substring(0, i);
  const value = input.substring(i + 1);
  return { key: key, value: value };
};

module.exports = {
  randomChoice,
  splitKeyValues,
  shuffle
};
