import config from "@/config.ts";
import { randomEmoji } from "@/lib/emojis";
import { middlewareFactory } from "@/middleware";
import { getFile } from "@/telegram";
import {
  CallbackQueryContext,
  Composer,
  Context,
  InlineKeyboard,
} from "grammy";
import { PhotoSize } from "grammy/types";

/**
 * In memory map to retrieve sticker URLs from callback query data
 * since Telegram has a limit of 64 bytes for callback query data
 */
const stickerMap = new Map<string, string>();

class Stickerify {
  #imageBlob: Blob;

  constructor(imageBlob: Blob) {
    if (config.httpSegmentation.url === undefined) {
      throw new Error("Missing HTTP_SEGMENTATION_URL env variable");
    }
    this.#imageBlob = imageBlob;
  }

  /**
   * @returns a list of URLs to the stickers cropped by the segmentation model
   */
  async stickers() {
    const res = await fetch(`${config.httpSegmentation.url}/segment/512`, {
      body: this.#imageBlob,
      method: "POST",
      headers: {
        Authorization: config.httpSegmentation.auth ?? "",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json<{ file_names: string[] }>();
    return json.file_names;
  }
}

/**
 * Short name of sticker set, to be used in t.me/addstickers/ URLs
 * (e.g., animals). Can contain only English letters, digits and underscores.
 * Must begin with a letter, can't contain consecutive underscores and must
 * end in "_by_<bot_username>". <bot_username> is case insensitive.
 * 1-64 characters.
 * @see https://core.telegram.org/bots/api#createnewstickerset
 */
export function generateStickerSetName(
  chatID: number,
  username: string,
  botName: string,
) {
  const truncatedChatID = chatID
    .toString()
    .slice(
      0,
      64 - username.length - "_".length - "_by_".length - botName.length,
    );
  return `${username}_${truncatedChatID}_by_${botName}`;
}

async function saveStickerCallback(ctx: CallbackQueryContext<Context>) {
  const stickerFileURL = stickerMap.get(ctx.match[1]);
  if (stickerFileURL === undefined) {
    await ctx.reply("Sticker not found");
    return;
  }
  if (ctx.chat?.id === undefined) {
    await ctx.reply("Cannot create sticker set for this chat");
    return;
  }
  if (ctx.from?.username === undefined) {
    await ctx.reply("Cannot create sticker set for this user");
    return;
  }

  const stickerSetName = generateStickerSetName(
    ctx.chat.id,
    ctx.from.username,
    ctx.me.username,
  );
  const sticker = {
    sticker: stickerFileURL,
    emoji_list: [randomEmoji()],
  };

  let success = false;
  try {
    await ctx.api.getStickerSet(stickerSetName);
    // sticker set exists, so we can add the sticker to it
    success = await ctx.api.addStickerToSet(
      ctx.from.id,
      stickerSetName,
      sticker,
    );
  } catch (error) {
    // sticker set does not exist, so we must create a new one
    success = await ctx.api.createNewStickerSet(
      ctx.from.id,
      stickerSetName,
      ctx.chat.id.toString(),
      [sticker],
      "static",
    );
  }
  if (!success) {
    await ctx.reply("Failed to save sticker", {
      reply_to_message_id: ctx.message?.message_id,
    });
  } else {
    stickerMap.delete(ctx.match[1]);

    await ctx.editMessageText("Saved");
    await ctx.reply(`Sticker saved in t.me/addstickers/${stickerSetName}`, {
      reply_to_message_id: ctx.message?.message_id,
    });
  }
}

function findBiggestPhoto(photos: PhotoSize[]) {
  let biggestPhoto = photos[0];
  for (const photo of photos) {
    if (photo.file_size && photo.file_size > (biggestPhoto.file_size ?? 0)) {
      biggestPhoto = photo;
    }
  }
  return biggestPhoto;
}

async function stickerifyCommand(ctx: Context) {
  if (ctx.chat?.id && ctx.msg?.reply_to_message?.photo) {
    const biggestPhoto = findBiggestPhoto(ctx.msg.reply_to_message.photo);
    let file: Awaited<ReturnType<typeof getFile>>;
    try {
      file = await getFile(biggestPhoto.file_id);
    } catch (error) {
      ctx.reply("Failed to download image from Telegram");
      return;
    }

    const url = `https://api.telegram.org/file/bot${config.telegramToken}/${file.result.file_path}`;
    const fileRes = await fetch(url);
    if (!fileRes.ok) {
      ctx.reply("Failed to download image from Telegram");
      return;
    }
    const fileBlob = await fileRes.blob();

    const stickerify = new Stickerify(fileBlob);
    let stickers: string[] = [];
    try {
      stickers = await stickerify.stickers();
    } catch (error) {
      await ctx.reply("Error while processing image");
      return;
    }

    for (const sticker of stickers) {
      const stk = await ctx.replyWithSticker(sticker);
      const stickerID = stickerMap.size + 1;
      stickerMap.set(stickerID.toString(), sticker);
      await ctx.reply("Save this sticker?", {
        reply_markup: new InlineKeyboard().text("Save", `savestk:${stickerID}`),
        reply_to_message_id: stk.message_id,
      });
    }
  }
}

export const stickerifyComposer = new Composer();
stickerifyComposer.hears(
  /^[/!]stickerify/,
  middlewareFactory(stickerifyCommand),
);
stickerifyComposer.callbackQuery(
  /savestk:(\d+)/,
  middlewareFactory(saveStickerCallback),
);
