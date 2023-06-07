import type { Message } from "grammy/types";
import { MediaType, setTypes } from "./enum";

export function fileIDFromMessage(msg: Message, mediaMsg: MediaType) {
  if (msg?.photo && mediaMsg.type === setTypes.photos) {
    return msg.photo[0].file_id;
  }
  if (msg?.sticker && mediaMsg.type === setTypes.stickers) {
    return msg.sticker.file_id;
  }
  if (msg?.document && mediaMsg.type === setTypes.gifs) {
    return msg.document.file_id;
  }
  if (msg?.video && mediaMsg.type === setTypes.gifs) {
    return msg.video.file_id;
  }
}
