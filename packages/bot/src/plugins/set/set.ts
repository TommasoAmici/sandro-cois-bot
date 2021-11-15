import TelegramBot from "node-telegram-bot-api";
import client from "../../redisClient";

const set = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  media: Media,
  key: string,
  fileId: string
) => {
  const hkey = `chat:${msg.chat.id}:${media.type}`;

  client.hset(hkey, key, fileId, (err, res) => {
    if (err) {
      bot.sendMessage(msg.chat.id, `Couldn't set ${key} :(`);
    } else {
      bot.sendMessage(msg.chat.id, `Set ${key}!`);
    }
  });
};

export default set;
