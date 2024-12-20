import type { Context, HearsContext } from "grammy";

const translationTable = [
  { find: /lt/gi, replace: "rd" },
  { find: /t/gi, replace: "d" },
  { find: /(ca|ci|co)/gi, replace: "ghe" },
  { find: /c/gi, replace: "g" },
  { find: /p/gi, replace: "b" },
  { find: /q/gi, replace: "g" },
  { find: /(ai|oi|ui)/gi, replace: "ei" },
  { find: /(ia|io|iu)/gi, replace: "ie" },
  { find: /(ua|uo|ui)/gi, replace: "ue" },
  { find: /([b-df-hj-np-tv-z])(a|i|o|u)\b/gi, replace: "$1e" },
  { find: /([b-df-hj-np-tv-z])(à|ì|ò|ù)\b/gi, replace: "$1è" },
  { find: /\b(a|i|o|u)([b-df-hj-np-tv-z])/gi, replace: "e$2" },
  { find: /\b(à|ì|ò|ù)([b-df-hj-np-tv-z])/gi, replace: "è$2" },
  {
    find: /([b-df-hj-np-tv-z])(a|i|o|u)([b-df-hj-np-tv-z])/gi,
    replace: "$1e$3",
  },
  {
    find: /([b-df-hj-np-tv-z])(à|ì|ò|ù)([b-df-hj-np-tv-z])/gi,
    replace: "$1è$3",
  },
];

export const convert = (msg: string) => {
  let convertedMessage = msg;
  for (const translation of translationTable) {
    convertedMessage = convertedMessage.replace(
      translation.find,
      translation.replace,
    );
  }
  return convertedMessage;
};

export const keddeInReply = async (ctx: Context): Promise<void> => {
  if (ctx.msg?.reply_to_message) {
    const text = ctx.msg.reply_to_message.text;
    if (text === undefined) {
      return;
    }

    const message = convert(text);
    await ctx.reply(message);
  }
};

export const kedde = async (ctx: HearsContext<Context>) => {
  const converted = convert(ctx.match[1]);
  const text = `hehehe ${converted} hehehe`;
  await ctx.reply(text);
};
