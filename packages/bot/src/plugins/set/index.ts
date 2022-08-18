import { Composer } from "grammy";
import get from "./get";
import list from "./list";
import { media } from "./media";
import setKey from "./setKey";
import setValue from "./setValue";
import { setText } from "./text";
import unset from "./unset";

export const keyValue = new Composer();
keyValue.use(setText);
// [A-Za-z\u00C0-\u017F\0-9\]
// regex for accented chars https://stackoverflow.com/a/11550799

// STICKERS
keyValue.hears(/^[/!]stklist(?:@\w+)?$/i, list(media.stickers));
keyValue.hears(
  /^[/!]setstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  setKey(media.stickers),
);
keyValue.hears(
  /^[/!]unsetstk(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  unset(media.stickers),
);
keyValue.hears(/^(?!.*http)(.+)\.stk$/i, get(media.stickers));
keyValue.on(
  ":sticker",
  setValue(/([A-Za-z\u00C0-\u017F\0-9\_]+)\.(stk)/i, media.stickers),
);

// IMAGES

keyValue.hears(
  /^(?!.*http)(.+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)$/i,
  get(media.photos),
);
keyValue.hears(
  /^[/!]setpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  setKey(media.photos),
);
keyValue.hears(/^[/!]piclist(?:@\w+)?$/i, list(media.photos));
keyValue.hears(
  /^[/!]unsetpic(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  unset(media.photos),
);
keyValue.on(
  ":photo",
  setValue(
    /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)/i,
    media.photos,
  ),
);

// GIFS
keyValue.hears(
  /^[/!]setgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  setKey(media.gifs),
);
keyValue.hears(/^[/!]giflist(?:@\w+)?$/i, list(media.gifs));
keyValue.hears(
  /^[/!]unsetgif(?:@\w+)? ([A-Za-z\u00C0-\u017F\0-9\_]+)/i,
  unset(media.gifs),
);
keyValue.hears(
  /^(?!.*http)(.+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)$/i,
  get(media.gifs),
);

keyValue.on(
  ":document",
  setValue(
    /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
    media.gifs,
  ),
);
keyValue.on(
  ":video",
  setValue(
    /([A-Za-z\u00C0-\u017F\0-9\_]+)\.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)/i,
    media.gifs,
  ),
);
