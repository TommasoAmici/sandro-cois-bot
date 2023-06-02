import { Context, HearsContext, NextFunction } from "grammy";

export function hearsMiddlewareFactory(
  hearsHandler: (ctx: HearsContext<Context>) => Promise<void> | void,
) {
  async function handler(ctx: HearsContext<Context>, next: NextFunction) {
    try {
      await hearsHandler(ctx);
    } catch (error) {
      console.error(error);
    }
    await next();
  }
  return handler;
}
