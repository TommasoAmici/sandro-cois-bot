import axios from "axios";
import utils from "./utils";
import { Message } from "node-telegram-bot-api";

const permalink = item => `\n\nhttps://old.reddit.com${item.data.permalink}`;

const url = item => `\n\n${item.data.url}`;

const buildMessage = item => {
  const links =
    url(item) === permalink(item)
      ? permalink(item)
      : `${url(item)}${permalink(item)}`;
  const text =
    item.data.selftext === ""
      ? `<b>${item.data.title}</b>`
      : `<b>${item.data.title}</b>\n\n${item.data.selftext}`;
  return `${text}${links}`;
};

export default bot => async (msg: Message, match: RegExpMatchArray) => {
  const subreddit = match[1].toLowerCase();
  let sortBy;
  if (match[2] === undefined) {
    sortBy = "hot";
  } else {
    sortBy = match[2].toLowerCase();
  }

  const baseApi = `https://old.reddit.com/r/${subreddit}/${sortBy}.json`;

  try {
    const response = await axios.get(baseApi);

    if (!response.data.data || response.data.data.length === 0) {
      bot.sendMessage(msg.chat.id, "Nothing found.");
    } else {
      const item = utils.randomChoice(
        utils.shuffle(response.data.data.children)
      );
      // find correct api method
      if (
        item.data.domain === "gfycat.com" ||
        item.data.url.includes(".gifv")
      ) {
        bot.sendVideo(
          msg.chat.id,
          item.data.preview.reddit_video_preview.fallback_url
        );
      } else if (item.data.domain === "youtu.be") {
        bot.sendMessage(msg.chat.id, buildMessage(item), {
          parse_mode: "html"
        });
      } else if (item.data.post_hint === "image") {
        bot.sendPhoto(msg.chat.id, item.data.url);
      }
      // hosted on reddit
      else if (item.data.post_hint === "hosted:video") {
        bot.sendVideo(msg.chat.id, item.data.media.reddit_video.fallback_url);
      }
      // external video hosting
      else if (item.data.post_hint === "rich:video") {
        bot.sendVideo(msg.chat.id, item.data.url);
      }
      // everything else
      else {
        bot.sendMessage(msg.chat.id, buildMessage(item), {
          parse_mode: "html"
        });
      }
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      bot.sendMessage(msg.chat.id, error.response.status);
    }
    console.error(error.response);
  }
};
