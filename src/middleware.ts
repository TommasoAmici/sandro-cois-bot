import type { NextFunction } from "grammy";

/**
 * Factory function to create a grammy middleware.
 * It should be used to wrap all handlers when they are registered.
 * This makes sure that messages are always handled by all registered handlers.
 */
export function middlewareFactory<T>(
  handler: (ctx: T) => Promise<void> | void,
) {
  return async (ctx: T, next: NextFunction) => {
    try {
      await handler(ctx);
    } catch (error) {
      console.error(error);
    }
    await next();
  };
}
