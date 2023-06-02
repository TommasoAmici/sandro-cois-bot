import { Message } from "grammy/types";
import { media } from "../../commands";

export function fileIDFromMessage(msg: Message, mediaMsg: Media) {
  if (msg?.photo && mediaMsg === media.photos) {
    return msg.photo[0].file_id;
  }
  if (msg?.sticker && mediaMsg === media.stickers) {
    return msg.sticker.file_id;
  }
  if (msg?.document && mediaMsg === media.gifs) {
    return msg.document.file_id;
  }
  if (msg?.video && mediaMsg === media.gifs) {
    return msg.video.file_id;
  }
}
