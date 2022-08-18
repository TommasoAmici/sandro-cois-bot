import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";

const GoogleTranslate = require("@vitalets/google-translate-api");

const translate =
  (to: string, from = "it") =>
  (ctx: HearsContext<Context>) => {
    GoogleTranslate(ctx.match[1], {
      to,
      from,
      agents: [
        "Mozilla/5.0 (Windows NT 10.0; ...",
        "Mozilla/4.0 (Windows NT 10.0; ...",
        "Mozilla/5.0 (Windows NT 10.0; ...",
      ],
    }).then(res => {
      ctx.reply(res.text);
    });
  };

export const gtranslate = new Composer();
gtranslate.hears(/^[/!]gaelico(?:@\w+)? ([\s\S]*)/i, translate("ga"));
gtranslate.hears(/^[/!]tedesco(?:@\w+)? ([\s\S]*)/i, translate("de"));
gtranslate.hears(/^[/!]francese(?:@\w+)? ([\s\S]*)/i, translate("fr"));
gtranslate.hears(/^[/!]olandese(?:@\w+)? ([\s\S]*)/i, translate("nl"));
gtranslate.hears(/^[/!]inglese(?:@\w+)? ([\s\S]*)/i, translate("en"));
gtranslate.hears(/^[/!]spagnolo(?:@\w+)? ([\s\S]*)/i, translate("es"));
gtranslate.hears(/^[/!]napoletano(?:@\w+)? ([\s\S]*)/i, translate("sw"));
