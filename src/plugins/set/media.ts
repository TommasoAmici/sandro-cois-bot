import type { Context, HearsContext } from "grammy";

import config from "@/config";
import { db } from "@/database/database";
import { Freesound } from "@/lib/freesound";
import { getImage } from "../getImage";
import { getGif, sendGif } from "../giphy";
import {
  AUDIO,
  GIF,
  PHOTO,
  STICKER,
  type MediaType,
  type SetType,
} from "./enum";
import { fileIDFromMessage } from "./getFileId";

/**
 * Usage: /setpic <key>
 * Usage: /setgif <key>
 * Usage: /setstk <key>
 *
 * When used as a reply to a message, sets the media as value for the key.
 * The media is returned whenever a message starts with the key + file extension.
 * For example, if you reply to a photo with `/setpic foo`, then whenever
 * someone sends a message starting with `foo.png`, the photo will be returned.
 * The same works for videos, gifs, and stickers.
 *
 * If the message is not a reply, the bot will ask you to reply to a message
 * with the media.
 */
export function setMediaCommand(media: MediaType) {
  return async (ctx: HearsContext<Context>) => {
    const setQuery = db.query<
      null,
      {
        $chat_id: number;
        $user_id: number | null;
        $type: SetType;
        $key: string;
        $value: string;
      }
    >(
      `INSERT INTO sets (chat_id, user_id, type, key, value)
      VALUES ($chat_id, $user_id, $type, $key, $value);`,
    );

    if (ctx.msg?.reply_to_message) {
      const key = ctx.match[1].toLowerCase();
      const fileId = fileIDFromMessage(ctx.msg.reply_to_message, media);
      if (fileId === undefined) {
        return;
      }
      setQuery.run({
        $chat_id: ctx.chat.id,
        $type: media.type,
        $key: key,
        $value: fileId,
        $user_id: ctx.from?.id ?? null,
      });
      await ctx.reply(`Set ${media.label} for ${key}.`);
    } else {
      await ctx.reply(
        `Reply to this message with the ${
          media.label
        } for ${ctx.match[1].toLowerCase()}.${media.ext}`,
      );
    }
  };
}

export function setOnMediaReceived(regex: RegExp, media: MediaType) {
  return async (ctx: Context) => {
    if (ctx.chat?.id && ctx.msg?.reply_to_message?.text) {
      let key: string | undefined;
      try {
        key = ctx.msg.reply_to_message.text.match(regex)?.[1].toLowerCase();
      } catch {
        key = undefined;
      }
      if (key !== null && key !== undefined) {
        const fileId = fileIDFromMessage(ctx.msg.reply_to_message, media);
        if (fileId) {
          const setQuery = db.query<
            null,
            {
              $chat_id: number;
              $user_id: number | null;
              $type: SetType;
              $key: string;
              $value: string;
            }
          >(
            "INSERT INTO sets (chat_id, type, key, value) VALUES ($chat_id, $user_id, $type, $key, $value);",
          );
          setQuery.run({
            $chat_id: ctx.chat.id,
            $type: media.type,
            $key: key,
            $value: fileId,
            $user_id: ctx.from?.id ?? null,
          });
          await ctx.reply(`Set ${media.label} for ${key}.`);
        }
      }
    }
  };
}

export function unsetMediaCommand(media: MediaType) {
  return async (ctx: HearsContext<Context>) => {
    const key = ctx.match[1].toLowerCase();
    const delQuery = db.query<
      { rowid: number },
      {
        $chat_id: number;
        $type: SetType;
        $key: string;
      }
    >(
      "DELETE FROM sets WHERE chat_id = $chat_id AND type = $type AND key = $key RETURNING rowid;",
    );
    const row = delQuery.get({
      $chat_id: ctx.chat.id,
      $type: media.type,
      $key: key,
    });
    if (row) {
      await ctx.reply(`Unset ${media.label} for ${key}.`);
    } else {
      await ctx.reply(`No ${media.label} set for ${key}.`);
    }
  };
}

async function handleStickers(
  fileID: string | undefined,
  ctx: HearsContext<Context>,
) {
  if (fileID !== undefined) {
    await ctx.replyWithSticker(fileID);
  }
}

async function handlePhoto(
  fileID: string | undefined,
  key: string,
  ctx: HearsContext<Context>,
) {
  if (fileID !== undefined) {
    ctx.replyWithPhoto(fileID);
  } else {
    // if no image is set try google api
    try {
      await getImage(key, ctx);
    } catch (error) {
      await ctx.reply("Error :(");
      console.error(error);
    }
  }
}

const freesound = new Freesound(config.freesoundToken);

async function handleAudio(
  fileID: string | undefined,
  key: string,
  ctx: HearsContext<Context>,
) {
  if (fileID !== undefined) {
    ctx.replyWithAudio(fileID);
  } else {
    // if no audio is set try freesound API
    const audio = await freesound.search(key);
    if (audio) {
      await ctx.replyWithAudio(audio.previews["preview-hq-mp3"]);
    } else {
      await ctx.reply("Error :(");
    }
  }
}

async function handleGifs(
  fileID: string | undefined,
  key: string,
  ctx: HearsContext<Context>,
) {
  if (fileID !== undefined) {
    await ctx.replyWithDocument(fileID);
  } else {
    try {
      const response = await getGif(key);
      await sendGif(ctx, response);
    } catch (error) {
      await ctx.reply("Error :(");
      console.error(error);
    }
  }
}

export function getMediaCommand(mediaType: MediaType) {
  return async (ctx: HearsContext<Context>) => {
    const query = db.query<
      { value: string },
      {
        $chat_id: number;
        $type: SetType;
        $key: string;
      }
    >(
      "SELECT value FROM sets WHERE chat_id = $chat_id AND type = $type AND key = $key;",
    );
    const key = ctx.match[1].toLowerCase();
    const row = query.get({
      $chat_id: ctx.chat.id,
      $type: mediaType.type,
      $key: key,
    });

    const fileId = row?.value;
    switch (mediaType.type) {
      case PHOTO:
        handlePhoto(fileId, key, ctx);
        break;
      case GIF:
        handleGifs(fileId, key, ctx);
        break;
      case STICKER:
        handleStickers(fileId, ctx);
        break;
      case AUDIO:
        handleAudio(fileId, key, ctx);
        break;
      default:
        break;
    }
  };
}

/**
 * Usage: `/piclist`
 * Usage: `/giflist`
 * Usage: `/stklist`
 *
 * Lists all keys for the given media type.
 */
export function listMediaCommand(mediaType: MediaType) {
  return async (ctx: HearsContext<Context>) => {
    const query = db.query<
      { key: string },
      {
        $chat_id: number;
        $type: SetType;
      }
    >("SELECT key FROM sets WHERE chat_id = $chat_id AND type = $type;");
    const rows = query.all({
      $chat_id: ctx.chat.id,
      $type: mediaType.type,
    });
    if (rows.length === 0) {
      await ctx.reply(`No ${mediaType.label} set.`);
      return;
    }
    const text = rows.map((row) => row.key).join("\n");
    await ctx.reply(text);
  };
}
