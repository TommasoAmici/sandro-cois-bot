import type { Context, HearsContext } from "grammy";

const translationTable = [
  { find: /c(a|i|o)/gi, replace: "ghe" },
  { find: /lt/gi, replace: "rd" },
  { find: /a|i|o/gi, replace: "e" },
  { find: /t/gi, replace: "d" },
  { find: /c/gi, replace: "g" },
  { find: /p/gi, replace: "b" },
  { find: /q/gi, replace: "g" },
];

const ghenverde = (msg: string) => {
  let convertedMessage = msg;
  translationTable.forEach(
    t => (convertedMessage = convertedMessage.replace(t.find, t.replace)),
  );
  return `hehehe ${convertedMessage} hehehe`;
};

export const kedde = (ctx: HearsContext<Context>) => {
  if (ctx.match[1] !== "") {
    return ctx.reply(ghenverde(ctx.match[1]));
  } else if (ctx.message?.reply_to_message?.text !== undefined) {
    return ctx.reply(ghenverde(ctx.message?.reply_to_message?.text));
  }
};
