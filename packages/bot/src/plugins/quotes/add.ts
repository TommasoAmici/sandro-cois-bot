import { Context, HearsContext } from "grammy";
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
  chatId: number,
  ctx: Context,
) => {
  // Prevent adding empty quotes
  // Since a command addquotedate exists, the regex for addquote may be triggered
  // by that command, resulting in an attempt to add a quote with body "date"
  const trimmedBody = body.trim();
  if (trimmedBody === "" || trimmedBody === "date") {
    return;
  }

  const key = `chat:${chatId}:quotes`;

  try {
    await createIndex(chatId);
  } catch (err) {
    // it will throw an error if the index already exists, not a problem
    console.error(err);
  }

  const id = await client.incr("quotes-id");
  await client.zadd(key, Date.now(), id);
  try {
    await client.hset(
      `${key}:${id}`,
      "body",
      trimmedBody,
      "author",
      author,
      "date",
      date,
    );
    await ctx.reply("Quote added!");
  } catch (error) {
    await ctx.reply("Couldn't add quote :(");
  }
};

export default async (ctx: HearsContext<Context>) => {
  const quote = utf8.encode(ctx.match[1]);
  await addQuote(quote, "", "", ctx.chat.id, ctx);
};
