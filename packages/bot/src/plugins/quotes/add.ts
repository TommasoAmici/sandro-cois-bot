import type { Context, HearsContext } from "grammy";
import * as utf8 from "utf8";
import client from "../../redisClient";

const createIndex = (chatID: number) =>
  client
    .call(
      "FT.CREATE",
      `chat:${chatID}:quotes-index`,
      "ON",
      "HASH",
      "PREFIX",
      1,
      `chat:${chatID}:quotes:`,
      "SCHEMA",
      "body",
      "TEXT",
      "author",
      "TEXT",
    )
    .then()
    .catch(err => console.error(err));

export const addQuote = async (
  body: string,
  author: string,
  date: string,
  ctx: HearsContext<Context>,
) => {
  // Prevent adding empty quotes
  // Since a command addquotedate exists, the regex for addquote may be triggered
  // by that command, resulting in an attempt to add a quote with body "date"
  const trimmedBody = body.trim();
  if (trimmedBody === "" || trimmedBody === "date") {
    return;
  }

  const key = `chat:${ctx.chat.id}:quotes`;

  try {
    createIndex(ctx.chat.id);
  } catch (err) {
    // it will throw an error if the index already exists, not a problem
    console.error(err);
  }

  const id = await client.incr("quotes-id");
  client.zadd(key, Date.now(), id);
  client
    .hset(`${key}:${id}`, "body", trimmedBody, "author", author, "date", date)
    .then(() => ctx.reply("Quote added!"))
    .catch(() => ctx.reply("Couldn't add quote :("));
};

export default (ctx: HearsContext<Context>): void => {
  const quote = utf8.encode(ctx.match[1]);
  addQuote(quote, "", null, ctx);
};
