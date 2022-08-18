import { Composer } from "grammy";
import list from "../list";
import { media } from "../media";
import unset from "../unset";
import get from "./get";
import set from "./set";

export default { setValue: set, get };
export const setText = new Composer();
setText.hears(/^[/!]setlist(?:@\w+)?$/i, list(media.text));
setText.hears(/^[/!]set(?:@\w+)? (.*?) (.+)/i, set(media.text));
setText.hears(/^[/!]unset(?:@\w+)? (.+)/i, unset(media.text));
setText.hears(/^\S+/i, get(media.text));
