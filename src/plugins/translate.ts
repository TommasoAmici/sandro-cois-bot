import { translate } from "@/lib/translate";
import { middlewareFactory } from "@/middleware";
import { Composer, Context, HearsContext } from "grammy";

function gtranslate(to: string, from = "it") {
  return async function (ctx: HearsContext<Context>) {
    const text = await translate(ctx.match[1], {
      to: to,
      from: from,
    });
    await ctx.reply(text);
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
gtranslateComposer.hears(
  /^[/!]arabo(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("ar")),
);
gtranslateComposer.hears(
  /^[/!]svedese(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("sv")),
);
gtranslateComposer.hears(
  /^[/!]yiddish(?:@\w+)? ([\s\S]*)/i,
  middlewareFactory(gtranslate("yi")),
);
