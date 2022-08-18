import { Composer } from "grammy";
import add from "./add";
import addFromReply from "./addFromReply";
import get from "./get";
import random from "./random";
import remove from "./remove";

export const quotes = new Composer();
quotes.hears(/^[/!]addquote(?:@\w+)? ?([\s\S]*)/i, add);
quotes.hears(/^[/!]addquote(?:@\w+)?$/i, addFromReply());
quotes.hears(/^[/!]addquotedate(?:@\w+)?$/i, addFromReply(true));
quotes.hears(/^[/!]unquote(?:@\w+)?$/i, remove);
quotes.hears(/^[/!]quote(?:@\w+)? (.+)/i, get);
quotes.hears(/^[/!]quote(?:@\w+)?$/i, random);
