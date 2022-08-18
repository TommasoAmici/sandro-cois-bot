import { Composer } from "grammy";
import utils from "./utils";
import { randomChoice } from "./utils/random";

const choices = [
  "😍",
  "🍆 💦 😫",
  "👌😂",
  "💯 ",
  "🔝 ",
  " ",
  "😂😂😂",
  " gago ",
  "🤔",
  "👏",
  "🙏",
  "🍆 💦 🍑",
  "🥰",
  "🥳",
  "🤪",
  "😈",
  "🙈",
];

const gagoFunction = (k: number): string => {
  let elements = [];
  for (let i = 0; i < k; i++) {
    elements.push(randomChoice(choices));
  }
  return elements.join("");
};
export const gago = new Composer();
gago.hears(/^[/!](\d+)gago/i, ctx => {
  const gagoIndex = +ctx.match[1];
  const message = gagoFunction(gagoIndex);
  utils.paginateMessages(ctx, message);
});
gago.hears(/^[/!](gago)+/i, ctx => {
  const message = "😂".repeat((ctx.match[0].length - 1) / 4);
  ctx.reply(message);
});
gago.hears(/^[/!](evilgago){2,}/i, ctx => {
  const message = "😡".repeat((ctx.match[0].length - 1) / 8);
  ctx.reply(message);
});
