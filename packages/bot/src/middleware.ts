import { NextFunction } from "grammy";

export function middlewareFactory<T>(
  handler: (ctx: T) => Promise<void> | void,
) {
  return async function (ctx: T, next: NextFunction) {
    try {
      await handler(ctx);
    } catch (error) {
      console.error(error);
    }
    await next();
  };
}
