import { middlewareFactory } from "@/middleware";
import { Composer } from "grammy";
import { mediaTypes } from "./enum";
import {
  getMediaCommand,
  listMediaCommand,
  setMediaCommand,
  setOnMediaReceived,
  unsetMediaCommand,
} from "./media";
import { getCommand, setCommand, setListCommand, unsetCommand } from "./text";

export const setsComposer = new Composer();

setsComposer.on(
  ":photo",
  middlewareFactory(
    setOnMediaReceived(
      /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)/i,
      mediaTypes.photos,
    ),
  ),
);
setsComposer.on(
  ":sticker",
  middlewareFactory(
    setOnMediaReceived(
      /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(stk)/i,
      mediaTypes.stickers,
    ),
  ),
);
setsComposer.on(
  ":document",
  middlewareFactory(
    setOnMediaReceived(
      /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
      mediaTypes.gifs,
    ),
  ),
);
setsComposer.on(
  ":video",
  middlewareFactory(
    setOnMediaReceived(
      /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
      mediaTypes.gifs,
    ),
  ),
);

// TEXT
setsComposer.hears(
  /^[/!]setlist(?:@\w+)?$/i,
  middlewareFactory(setListCommand),
);
setsComposer.hears(
  /^[/!]set(?:@\w+)? (.*?) (.+)/i,
  middlewareFactory(setCommand),
);
setsComposer.hears(
  /^[/!]unset(?:@\w+)? (.+)/i,
  middlewareFactory(unsetCommand),
);
setsComposer.hears(/^\S+/i, middlewareFactory(getCommand));

// IMAGES
setsComposer.hears(
  /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)$/i,
  middlewareFactory(getMediaCommand(mediaTypes.photos)),
);
setsComposer.hears(
  /^[/!]setpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(setMediaCommand(mediaTypes.photos)),
);
setsComposer.hears(
  /^[/!]piclist(?:@\w+)?$/i,
  middlewareFactory(listMediaCommand(mediaTypes.photos)),
);
setsComposer.hears(
  /^[/!]unsetpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(unsetMediaCommand(mediaTypes.photos)),
);

// STICKERS
setsComposer.hears(
  /^[/!]stklist(?:@\w+)?$/i,
  middlewareFactory(listMediaCommand(mediaTypes.stickers)),
);
setsComposer.hears(
  /^[/!]setstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(setMediaCommand(mediaTypes.stickers)),
);
setsComposer.hears(
  /^[/!]unsetstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(unsetMediaCommand(mediaTypes.stickers)),
);
setsComposer.hears(
  /^(?!.*http)(.+)\.stk$/i,
  middlewareFactory(getMediaCommand(mediaTypes.stickers)),
);

// GIFS
setsComposer.hears(
  /^[/!]setgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(setMediaCommand(mediaTypes.gifs)),
);
setsComposer.hears(
  /^[/!]giflist(?:@\w+)?$/i,
  middlewareFactory(listMediaCommand(mediaTypes.gifs)),
);
setsComposer.hears(
  /^[/!]unsetgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(unsetMediaCommand(mediaTypes.gifs)),
);
setsComposer.hears(
  /^(?!.*http)(.+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)$/i,
  middlewareFactory(getMediaCommand(mediaTypes.gifs)),
);

// AUDIO
setsComposer.hears(
  /^[/!]setaudio(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(setMediaCommand(mediaTypes.audio)),
);
setsComposer.hears(
  /^[/!]listaudio(?:@\w+)?$/i,
  middlewareFactory(listMediaCommand(mediaTypes.audio)),
);
setsComposer.hears(
  /^[/!]unsetaudio(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  middlewareFactory(unsetMediaCommand(mediaTypes.audio)),
);
setsComposer.hears(
  /^(?!.*http)(.+)\.(mp3|wav|ogg)$/i,
  middlewareFactory(getMediaCommand(mediaTypes.audio)),
);
