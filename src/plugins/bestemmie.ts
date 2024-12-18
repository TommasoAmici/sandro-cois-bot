import { db } from "@/database/database";
import { middlewareFactory } from "@/middleware";
import { upsertUser } from "@/user";
import { Composer, type Context, type HearsContext } from "grammy";
import { prettyPrintStanding } from "./utils/printStandings";

async function bestemmiatoriCommand(ctx: HearsContext<Context>) {
  const query = db.query<
    { text: string; count: number },
    { $chat_id: number }
  >(`
    SELECT COALESCE(u.username, u.first_name, 'no-name') as text, SUM(b.count) AS count
    FROM bestemmie b
    JOIN users u ON b.user_id = u.id
    WHERE b.chat_id = $chat_id
    GROUP BY b.user_id
    ORDER BY count DESC
  `);
  const rows = query.all({ $chat_id: ctx.chat.id });
  const text = `FERVIDI CREDENTI  📿🧎‍♂️\n\n${prettyPrintStanding(rows)}`;
  await ctx.reply(text);
}

function storeBestemmiaMiddleware(ctx: HearsContext<Context>) {
  const text = ctx.msg?.text;
  if (text === undefined || ctx.from?.id === undefined) {
    return;
  }
  upsertUser(ctx.from);
  const query = db.query<
    null,
    {
      $chat_id: number;
      $user_id: number;
      $body: string;
    }
  >(
    `
    INSERT INTO bestemmie (chat_id, user_id, body) VALUES($chat_id, $user_id, $body);
    `,
  );
  query.run({
    $chat_id: ctx.chat.id,
    $user_id: ctx.from.id,
    $body: text,
  });
}

async function myBestemmieCommand(ctx: HearsContext<Context>) {
  if (ctx.from?.id === undefined) {
    return;
  }

  const userQuery = db.query<
    { first_name: string | null; username: string | null },
    [number]
  >("SELECT first_name, username FROM users WHERE id = ?;");
  const user = userQuery.get(ctx.from.id);
  const query = db.query<{ text: string; count: number }, [number, number]>(
    `SELECT LOWER(body) AS text, SUM(count) AS count
    FROM bestemmie
    WHERE chat_id = ? AND user_id = ?
    GROUP BY text
    ORDER BY count DESC LIMIT 20;`,
  );
  const rows = query.all(ctx.chat.id, ctx.from.id);
  const name = user?.username ?? user?.first_name ?? "";
  const header = `LE BESTEMMIE DI ${name} 📿🧎‍♂️`;
  const message = `${header}\n\n${prettyPrintStanding(rows)}`;
  await ctx.reply(message);
}

export const bestemmieComposer = new Composer();

bestemmieComposer.hears(
  /((porc(o|a)d?)|(mannaggia( al? )?)|\b)(dio|gesù|cristo|madonna|padre pio|san(ta|to|ti|t')? \w+)( \w+)?/i,
  middlewareFactory(storeBestemmiaMiddleware),
);
bestemmieComposer.hears(
  /^[/!]le_mie_bestemmie$/i,
  middlewareFactory(myBestemmieCommand),
);
bestemmieComposer.hears(
  /^[/!]bestemmiatori$/i,
  middlewareFactory(bestemmiatoriCommand),
);
