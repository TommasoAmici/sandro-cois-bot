export const randomChoice = <T>(choices: T[]): T =>
  choices[Math.floor(Math.random() * choices.length)];

// random number between min and max inclusive
export const randInt = (min: number, max: number): number => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
};
