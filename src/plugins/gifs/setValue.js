module.exports = (bot, db) => msg => {
  const regexGif = new RegExp(
    /(\w+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i
  );
  const key = msg.reply_to_message.text.match(regexGif)[1];
  db.set(key, msg.document.file_id);
  bot.sendMessage(msg.chat.id, "Gif set!");
};