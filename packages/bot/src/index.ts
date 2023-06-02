import { run } from "@grammyjs/runner";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Bot } from "grammy";

import { initBot } from "./commands";
import config from "./config";

if (!config.telegramToken) {
  throw new Error("Missing TELEGRAM_TOKEN env variable");
}

const bot = new Bot(config.telegramToken);
const throttler = apiThrottler();
bot.api.config.use(throttler);

initBot(bot);

console.log("Starting bot...");
run(bot);
