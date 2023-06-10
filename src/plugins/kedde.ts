import { Context, HearsContext } from "grammy";

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
  for (const translation of translationTable) {
    convertedMessage = convertedMessage.replace(
      translation.find,
      translation.replace,
    );
  }
  return `hehehe ${convertedMessage} hehehe`;
};

export const keddeInReply = async (ctx: Context): Promise<void> => {
  if (ctx.msg?.reply_to_message) {
    const text = ctx.msg.reply_to_message.text;
    if (text === undefined) {
      return;
    }

    const message = ghenverde(text);
    await ctx.reply(message);
  }
};

export const kedde = async (ctx: HearsContext<Context>) => {
  await ctx.reply(ghenverde(ctx.match[1]));
};
