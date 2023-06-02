import { Context, HearsContext } from "grammy";
import { addQuote } from "./add";

export default (addDate = false) =>
  async (ctx: HearsContext<Context>): Promise<void> => {
    const msgReply = ctx.msg?.reply_to_message;
    if (msgReply && msgReply.text && msgReply.text.length !== 0) {
      const author =
        msgReply.forward_from === undefined
          ? msgReply.from?.first_name
          : msgReply.forward_from.first_name;

      let date: string | undefined;
      if (addDate) {
        date = new Date(msgReply.date * 1000).toLocaleDateString("it-IT");
      }

      await addQuote(msgReply.text, author ?? "", date ?? "", ctx.chat.id, ctx);
    }
  };
