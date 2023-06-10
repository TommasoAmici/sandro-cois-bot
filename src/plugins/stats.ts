import { db } from "@/database/database";
import { middlewareFactory } from "@/middleware";
import { upsertUser } from "@/user";
import { Composer, Context, HearsContext } from "grammy";
import { prettyPrintStanding } from "./utils/printStandings";

function statsMiddleware(ctx: Context) {
  if (ctx.chat?.id === undefined || ctx.from?.id === undefined) {
    return;
  }
  db.run("BEGIN;");
  upsertUser(ctx.from);
  const query = db.query(
    `
    INSERT INTO stats (chat_id, user_id, messages_count)
    VALUES (?1, ?2, 1)
    ON CONFLICT(chat_id, user_id)
    DO UPDATE SET messages_count = messages_count + 1;
    `,
  );
  query.run(ctx.chat.id, ctx.from.id);
  db.run("COMMIT;");
}

async function statsCommand(ctx: HearsContext<Context>) {
  const query = db.query<{ text: string; count: number }, [number]>(`
    SELECT COALESCE(u.username, u.first_name, 'no-name') as text, s.messages_count AS count
    FROM stats s
    JOIN users u ON s.user_id = u.id
    WHERE s.chat_id = ?1
    GROUP BY s.user_id
    ORDER BY count DESC
  `);
  const rows = query.all(ctx.chat.id);
  const text = `STATS DELL'ERA SANDRO COIS\n\n${prettyPrintStanding(rows)}`;
  await ctx.reply(text);
}

async function setStatsCommand(ctx: HearsContext<Context>) {
  const query = db.query<
    { text: string; count: number },
    { $chat_id: number }
  >(`
    SELECT COALESCE(u.username, u.first_name, 'no-name') as text, COUNT(s.user_id) AS count
    FROM sets s
    JOIN users u ON s.user_id = u.id
    WHERE s.chat_id = $chat_id
    GROUP BY s.user_id
    ORDER BY count DESC
  `);
  const rows = query.all({ $chat_id: ctx.chat.id });
  const text = `SET STATS DELL'ERA SANDRO COIS\n\n${prettyPrintStanding(rows)}`;
  await ctx.reply(text);
}

export const statsComposer = new Composer();

statsComposer.on("message", middlewareFactory(statsMiddleware));
statsComposer.hears(/^[/!]stats(?:@\w+)?$/i, middlewareFactory(statsCommand));
statsComposer.hears(
  /^[/!]setstats(?:@\w+)?$/i,
  middlewareFactory(setStatsCommand),
);
