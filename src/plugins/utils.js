const randomChoice = choices =>
  choices[Math.floor(Math.random() * choices.length)];

const splitKeyValues = input => {
  const i = input.indexOf(" ");
  const key = input.substring(0, i);
  const value = input.substring(i + 1);
  return { key: key, value: value };
};

module.exports = {
  randomChoice,
  splitKeyValues
};
