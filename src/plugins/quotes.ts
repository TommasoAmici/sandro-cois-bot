import { db } from "@/database/database";
import { middlewareFactory } from "@/middleware";
import { upsertUser } from "@/user";
import { escapeHTML } from "bun";
import {
  CallbackQueryContext,
  Composer,
  Context,
  HearsContext,
  InlineKeyboard,
} from "grammy";

export function insertQuote(
  chatID: number,
  body: string,
  userID: number | null,
  authorID: number | null,
  showDate = false,
  createdAt: string | null = null,
) {
  const addQuoteQuery = db.query<
    { rowid: number },
    {
      $chat_id: number;
      $user_id: number | null;
      $author_id: number | null;
      $body: string;
      $show_date: boolean;
      $created_at: string | null;
    }
  >(
    `INSERT INTO quotes (chat_id, user_id, author_id, body, show_date, created_at)
     VALUES ($chat_id, $user_id, $author_id, $body, $show_date, COALESCE($created_at, CURRENT_TIMESTAMP))
     RETURNING rowid;`,
  );
  const addQuoteToSearchIndex = db.query<
    null,
    {
      $chat_id: number;
      $quote_id: number;
      $author_name: string | null;
      $body: string;
    }
  >(
    `INSERT INTO quotes_search (chat_id, quote_id, body, author)
    VALUES ($chat_id, $quote_id, $body, $author_name);`,
  );
  const row = addQuoteQuery.get({
    $chat_id: chatID,
    $user_id: userID,
    $author_id: authorID,
    $body: body,
    $show_date: showDate,
    $created_at: createdAt,
  });
  if (row === null) {
    throw new Error("Insert query didn't return rowid");
  }
  let authorName = null;
  if (authorID) {
    const authorQuery = db.query<
      { author_name: string },
      { $author_id: number }
    >(
      "SELECT COALESCE(u.username, u.first_name, '') AS author_name FROM users u WHERE u.id = $author_id;",
    );
    const row = authorQuery.get({ $author_id: authorID });
    authorName = row?.author_name ?? null;
  }
  addQuoteToSearchIndex.run({
    $chat_id: chatID,
    $quote_id: row.rowid,
    $author_name: authorName,
    $body: body,
  });
}

async function addQuoteCommand(ctx: HearsContext<Context>) {
  // Prevent adding empty quotes
  // Since a command addquotedate exists, the regex for addquote may be triggered
  // by that command, resulting in an attempt to add a quote with body "date"
  const trimmedBody = ctx.match[1].trim();
  if (trimmedBody === "" || trimmedBody === "date") {
    return;
  }
  if (!ctx.chat?.id) {
    return;
  }
  const userID = ctx.from?.id ?? null;
  const authorID = null;

  try {
    insertQuote(ctx.chat.id, trimmedBody, userID, authorID);
    await ctx.reply("Quote added!");
  } catch (error) {
    console.error(error);
    await ctx.reply("Couldn't add quote :(");
  }
}

function addQuoteFromReplyCommand({ addDate = false }: { addDate: boolean }) {
  return async function (ctx: HearsContext<Context>) {
    const msgReply = ctx.msg?.reply_to_message;
    if (msgReply?.text && msgReply.text.length !== 0) {
      const author = msgReply.forward_from ?? msgReply.from;
      upsertUser(author);
      const authorID = author?.id ?? null;

      try {
        insertQuote(
          ctx.chat.id,
          msgReply.text.trim(),
          ctx.from?.id ?? null,
          authorID,
          addDate,
        );
        await ctx.reply("Quote added!");
      } catch (error) {
        console.error(error);
        await ctx.reply("Couldn't add quote :(");
      }
    }
  };
}

type Quote = {
  rowid: number;
  body: string;
  author: string | null;
  show_date: boolean;
  created_at: string;
};

function formatQuote(quote: Quote) {
  let body = quote.body;
  if (quote.author) {
    body += `\n- ${quote.author}`;
  }
  if (quote.show_date) {
    body += ` - ${quote.created_at}`;
  }
  return body;
}

async function randomQuoteCommand(ctx: HearsContext<Context>) {
  const randomQuoteQuery = db.query<Quote, [number]>(
    "SELECT body, author_id, show_date, created_at FROM quotes WHERE chat_id = ? ORDER BY RANDOM() LIMIT 1;",
  );
  const row = randomQuoteQuery.get(ctx.chat?.id);
  if (row) {
    await ctx.reply(formatQuote(row));
  }
}

function searchQuotes(query: string, chatID: number, limit = 1) {
  const searchQuery = db.query<Quote, [string, number, number]>(
    `
      SELECT q.rowid, q.body, COALESCE(u.username, u.first_name, '') AS author, q.show_date, q.created_at
      FROM quotes q
      LEFT JOIN users u ON u.id = q.author_id
      WHERE q.rowid IN (
        SELECT quote_id
        FROM quotes_search
        WHERE quotes_search MATCH ?1 AND chat_id = ?2 ORDER BY RANDOM()
        LIMIT ?3
      );`,
  );
  // Remove special characters from query to prevent sqlite errors
  const row = searchQuery.all(query.replaceAll(/[!@#\$]/gi, ""), chatID, limit);
  return row;
}

async function quoteSearchCommand(ctx: HearsContext<Context>) {
  const search = ctx.match[1];
  if (search.trim() === "") {
    await randomQuoteCommand(ctx);
    return;
  }

  const rows = searchQuotes(search, ctx.chat.id);
  if (rows.length !== 0) {
    await ctx.reply(formatQuote(rows[0]));
  } else {
    await ctx.reply("No quotes found :(");
  }
}

function deleteQuote(rowid: number) {
  db.run("BEGIN;");
  db.run("DELETE FROM quotes WHERE rowid = ?;", [rowid]);
  db.run("DELETE FROM quotes_search WHERE quote_id = ?;", [rowid]);
  db.run("COMMIT;");
}

async function removeQuote(ctx: HearsContext<Context>) {
  if (
    ctx.msg?.reply_to_message?.text &&
    ctx.msg.reply_to_message.text.length !== 0
  ) {
    const query = ctx.msg.reply_to_message.text;
    const rows = searchQuotes(query, ctx.chat.id, 5);
    if (rows.length === 0) {
      await ctx.reply("No quotes found");
    } else if (rows.length === 1) {
      deleteQuote(rows[0].rowid);
      await ctx.reply("Quote removed!");
    } else {
      await ctx.reply(
        "I found more than one quote, which one do you want to remove?",
      );
      for (const row of rows) {
        await ctx.reply(formatQuote(row), {
          reply_markup: new InlineKeyboard().text(
            "Delete",
            `unquote:${row.rowid}`,
          ),
        });
      }
    }
  }
}

async function removeQuoteCallback(ctx: CallbackQueryContext<Context>) {
  const rowid = parseInt(ctx.match[1]);
  try {
    deleteQuote(rowid);
    await ctx.answerCallbackQuery({ text: "Quote removed!" });
    await ctx.editMessageText(`<s>${escapeHTML(ctx.msg?.text ?? "")}</s>`, {
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error(error);
    await ctx.answerCallbackQuery({
      text: "Something went wrong while removing quote :(",
    });
  }
}

export const quoteComposer = new Composer();

quoteComposer.hears(
  /^[/!]addquote(?:@\w+)? ?([\s\S]*)/i,
  middlewareFactory(addQuoteCommand),
);
quoteComposer.hears(
  /^[/!]addquote(?:@\w+)?$/i,
  middlewareFactory(addQuoteFromReplyCommand({ addDate: false })),
);
quoteComposer.hears(
  /^[/!]addquotedate(?:@\w+)?$/i,
  middlewareFactory(addQuoteFromReplyCommand({ addDate: true })),
);
quoteComposer.callbackQuery(
  /unquote:(\d+)/,
  middlewareFactory(removeQuoteCallback),
);
quoteComposer.hears(/^[/!]unquote(?:@\w+)?$/i, middlewareFactory(removeQuote));
quoteComposer.hears(
  /^[/!]quote(?:@\w+)? (.+)/i,
  middlewareFactory(quoteSearchCommand),
);
quoteComposer.hears(
  /^[/!]quote(?:@\w+)?$/i,
  middlewareFactory(randomQuoteCommand),
);
