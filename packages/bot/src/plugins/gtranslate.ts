import { translate } from "@vitalets/google-translate-api";
import { Context, HearsContext } from "grammy";

export default (to: string, from = "it") =>
  (ctx: HearsContext<Context>): void => {
    translate(ctx.match[1], {
      to: to,
      from: from,
    })
      .then(res => {
        ctx.reply(res.text);
      })
      .catch(err => {
        console.error(err);
      });
  };
