import { Database } from "bun:sqlite";

export const db = new Database("bot.sqlite", { create: true });
