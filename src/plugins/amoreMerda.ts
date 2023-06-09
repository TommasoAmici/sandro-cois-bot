import { db } from "@/database/database";
import { middlewareFactory } from "@/middleware";
import { upsertUser } from "@/user";
import { remove as removeDiacritics } from "diacritics";
import { Composer, Context, HearsContext } from "grammy";
import { prettyPrintStanding } from "./utils/printStandings";

export const cleanKey = (word: string): string => {
  return word.toLowerCase().trim().replace("@", "");
};

/**
 * Records a user's expression of pleasure
 */
function amore(ctx: HearsContext<Context>) {
  if (
    ctx.match[0] === "/ amore" ||
    ctx.match[0] === "/amore" ||
    ctx.from?.id === undefined
  ) {
    return;
  }
  const message = cleanKey(removeDiacritics(ctx.match[0]).replace("amore", ""));
  if (message.trim() === "") {
    return;
  }
  db.run("BEGIN;");
  upsertUser(ctx.from);
  const query = db.query<
    null,
    {
      $chat_id: number;
      $user_id: number;
      $body: string;
    }
  >(`
    INSERT INTO love_hate (chat_id, user_id, body, love)
    VALUES ($chat_id, $user_id, $body, 1)
    ON CONFLICT (chat_id, user_id, body) DO UPDATE
    SET love = love + 1;
  `);
  query.run({
    $chat_id: ctx.chat.id,
    $user_id: ctx.from?.id,
    $body: message,
  });
  db.run("COMMIT;");
}

export const recursivelyRemoveMerda = (word: string): string => {
  const replaced = word.replace("mmerda", "merda");
  if (replaced === word) {
    return word.replace("merda", " merda");
  }
  return recursivelyRemoveMerda(replaced);
};

export const cleanMerda = (word: string): string | undefined => {
  const sanitized = recursivelyRemoveMerda(
    removeDiacritics(word.toLowerCase()),
  );
  const match = /^(.+)\s*merda$/gi.exec(sanitized);
  if (match === null) {
    return undefined;
  }
  return cleanKey(match[1]);
};

/**
 * Records a user's expression of displeasure
 */
export const merda = async (ctx: HearsContext<Context>) => {
  if (
    ctx.match[0] === "/ merda" ||
    ctx.match[0] === "/merda" ||
    ctx.from?.id === undefined
  ) {
    return;
  }

  const body = ctx.match[0];
  const message = cleanMerda(body);
  if (message === undefined || message.trim() === "") {
    return;
  }
  db.run("BEGIN;");
  upsertUser(ctx.from);
  const query = db.query<
    null,
    {
      $chat_id: number;
      $user_id: number;
      $body: string;
    }
  >(`
    INSERT INTO love_hate (chat_id, user_id, body, hate)
    VALUES ($chat_id, $user_id, $body, 1)
    ON CONFLICT (chat_id, user_id, body) DO UPDATE
    SET hate = hate + 1;
  `);
  query.run({
    $chat_id: ctx.chat.id,
    $user_id: ctx.from?.id,
    $body: message,
  });
  db.run("COMMIT;");
};

/**
 * Prints a summary of the pleasures recorded
 * in the current chat
 */
async function summaryAmore(ctx: Context) {
  const chatID = ctx.chat?.id;
  if (chatID === undefined) {
    return;
  }
  const query = db.query<
    { text: string; count: number },
    { $chat_id: number }
  >(`
      SELECT l.body as text, SUM(l.love) AS count
      FROM love_hate l
      WHERE l.chat_id = $chat_id
      GROUP BY l.chat_id, l.body
      ORDER BY count DESC
      LIMIT 20
    `);
  const rows = query.all({ $chat_id: chatID });
  if (rows.length === 0) {
    await ctx.reply("Nessun amore espresso");
    return;
  }

  const message =
    "CLASSIFICA DELL'AMORE 😍" + "\n\n" + prettyPrintStanding(rows);
  await ctx.reply(message);
}

/**
 * Prints a summary of the displeasures recorded
 * in the current chat
 */
async function summaryMerda(ctx: Context) {
  const chatID = ctx.chat?.id;
  if (chatID === undefined) {
    return;
  }
  const query = db.query<
    { text: string; count: number },
    { $chat_id: number }
  >(`
      SELECT l.body as text, SUM(l.hate) AS count
      FROM love_hate l
      WHERE l.chat_id = $chat_id
      GROUP BY l.chat_id, l.body
      ORDER BY count DESC
      LIMIT 20
    `);
  const rows = query.all({ $chat_id: chatID });
  if (rows.length === 0) {
    await ctx.reply("Nessuna merda espressa");
    return;
  }

  const message =
    "CLASSIFICA DELLA MERDA 🤢" + "\n\n" + prettyPrintStanding(rows);
  await ctx.reply(message);
}

export const amoreMerdaComposer = new Composer();
amoreMerdaComposer.hears(/^(.+)\s*amore$/gi, middlewareFactory(amore));
amoreMerdaComposer.hears(/^(.+)\s*merda$/gi, middlewareFactory(merda));
amoreMerdaComposer.hears(/^[/!]amore$/gi, middlewareFactory(summaryAmore));
amoreMerdaComposer.hears(/^[/!]merda$/gi, middlewareFactory(summaryMerda));
