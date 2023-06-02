import { Context, NextFunction } from "grammy";
import client from "../../redisClient";

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.from !== undefined && ctx.chat !== undefined) {
    const key = `chat:${ctx.chat.id}:user:${ctx.from.id}`;
    const stats = await client.hincrby(key, "stats", 1);
    if (stats === 1) {
      await client.hset(key, "name", ctx.from.username ?? ctx.from.first_name);
    }
  }

  await next();
};
