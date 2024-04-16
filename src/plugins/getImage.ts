import { randomChoice } from "./utils/random";

import google from "googlethis";
import { Context, HearsContext } from "grammy";

const userAgents = [
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    pct: 20.36,
  },
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.3",
    pct: 14.04,
  },
  {
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    pct: 6.77,
  },
  {
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    pct: 6.57,
  },
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.203",
    pct: 6.12,
  },
  {
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15",
    pct: 6.02,
  },
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    pct: 5.22,
  },
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.54",
    pct: 4.86,
  },
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
    pct: 3.16,
  },
  {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.20",
    pct: 2.61,
  },
];

export const getImage = async (
  query: string,
  ctx: HearsContext<Context>,
): Promise<void> => {
  let images: Awaited<ReturnType<typeof google.image>>;
  try {
    images = await google.image(query, {
      safe: false,
      axios_config: {
        headers: {
          "User-Agent":
            userAgents[Math.floor(Math.random() * userAgents.length)].ua,
          "Accept-Encoding": "identity",
        },
      },
    });
  } catch (error) {
    console.error(error);
    await ctx.reply("Error while fetching image.", {
      reply_to_message_id: ctx.msg.message_id,
    });
    return;
  }
  if (!images || images.length === 0) {
    await ctx.reply("No photo found.", {
      reply_to_message_id: ctx.msg.message_id,
    });
  } else {
    const item = randomChoice(images);
    await ctx.replyWithPhoto(item.url, {
      reply_to_message_id: ctx.msg.message_id,
    });
  }
};

export default (ctx: HearsContext<Context>) => {
  if (ctx.msg.from?.username === "aridatecezeman") {
    ctx.reply("Zitto coglione!");
    return;
  }
  let query = ctx.match[1];

  if (query === undefined && ctx.msg.reply_to_message?.text) {
    query = ctx.msg.reply_to_message.text;
  }

  if (!query || query.trim() === "") {
    return;
  }

  getImage(query, ctx);
};
