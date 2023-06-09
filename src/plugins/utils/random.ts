export const randomChoice = <T>(choices: T[]): T =>
  choices[Math.floor(Math.random() * choices.length)];

// random number between min and max inclusive
export const randInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
