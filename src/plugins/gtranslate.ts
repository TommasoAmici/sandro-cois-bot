import { middlewareFactory } from "@/middleware";
import { translate } from "@vitalets/google-translate-api";
import { Composer, Context, HearsContext } from "grammy";

function gtranslate(to: string, from = "it") {
  return function (ctx: HearsContext<Context>) {
    translate(ctx.match[1], {
      to: to,
      from: from,
    })
      .then((res) => {
        ctx.reply(res.text);
      })
      .catch((err) => {
        console.error(err);
      });
  };
}

export const gtranslateComposer = new Composer();

gtranslateComposer.hears(
  /^[/!]gaelico(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("ga")),
);
gtranslateComposer.hears(
  /^[/!]tedesco(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("de")),
);
gtranslateComposer.hears(
  /^[/!]francese(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("fr")),
);
gtranslateComposer.hears(
  /^[/!]olandese(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("nl")),
);
gtranslateComposer.hears(
  /^[/!]inglese(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("en")),
);
gtranslateComposer.hears(
  /^[/!]spagnolo(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("es")),
);
gtranslateComposer.hears(
  /^[/!]napoletano(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("sw")),
);
