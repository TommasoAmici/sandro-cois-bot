import { Context, HearsContext } from "grammy";
import { randomChoice } from "./utils/random";

const randomSequence = (options: string[]) => {
  const n = 1 + Math.floor(Math.random() * 3);
  const sequence: string[] = [];
  for (let index = 0; index < n; index++) {
    sequence.push(randomChoice(options));
  }
  return sequence.join("");
};

const translationTable = [
  { find: /a/gi, replace: ["á", "à", "å", "ä", "æ", "â", "a", "a", "a", "a"] },
  { find: /e/gi, replace: ["é", "è", "e", "ë", "ê", "e", "e", "e", "e"] },
  { find: /i/gi, replace: ["î", "i", "ï", "ì", "í", "i", "i", "i", "i"] },
  {
    find: /o/gi,
    replace: ["ô", "o", "ö", "ò", "ó", "ø", "o", "o", "o", "o", "œ"],
  },
  { find: /u/gi, replace: ["û", "u", "ü", "ù", "ú", "u", "u", "u", "u"] },
];

const convert = (msg: string) => {
  let convertedMessage = msg;
  translationTable.forEach(
    t =>
      (convertedMessage = convertedMessage.replace(
        t.find,
        randomSequence(t.replace),
      )),
  );
  return convertedMessage;
};

export const cursiveInReply = async (ctx: Context): Promise<void> => {
  if (ctx.msg?.reply_to_message) {
    const text = ctx.msg.reply_to_message.text;
    if (text === undefined) {
      return;
    }

    const message = convert(text);
    await ctx.reply(message);
  }
};

export const cursive = async (ctx: HearsContext<Context>) => {
  await ctx.reply(convert(ctx.match[1]));
};
