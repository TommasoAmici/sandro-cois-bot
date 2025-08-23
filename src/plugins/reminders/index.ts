import { db } from "@/database/database";
import { middlewareFactory } from "@/middleware";
import { Composer, type Context, type HearsContext } from "grammy";
import { Reminders } from "./Reminders";
import { extractTimeFromMessage, parseTime } from "./timeParser";

const reminders = new Reminders(db);

async function remindMeCommand(ctx: HearsContext<Context>) {
  if (!ctx.chat?.id || !ctx.from?.id) {
    return;
  }

  const isReply = !!ctx.msg?.reply_to_message;
  const commandMatch = ctx.match?.[1]?.trim();

  let remindAt: Date | null = null;
  let reminderText: string | undefined;
  let replyToMessageId: number | undefined;

  if (isReply && ctx.msg?.reply_to_message) {
    const repliedMessage = ctx.msg.reply_to_message;
    replyToMessageId = repliedMessage.message_id;

    if (commandMatch) {
      remindAt = parseTime(commandMatch);
      reminderText = repliedMessage.text || repliedMessage.caption;
    } else if (repliedMessage.text) {
      remindAt = extractTimeFromMessage(repliedMessage.text);
      reminderText = repliedMessage.text;
    } else if (repliedMessage.caption) {
      remindAt = extractTimeFromMessage(repliedMessage.caption);
      reminderText = repliedMessage.caption;
    }

    if (!remindAt) {
      await ctx.reply(
        "Non riesco a capire quando vuoi essere ricordato. Prova con un'espressione come 'tra 5 minuti', 'domani alle 15', 'lunedì prossimo', ecc.",
        { reply_to_message_id: ctx.msg.message_id },
      );
      return;
    }
  } else {
    if (!commandMatch) {
      await ctx.reply(
        "Usa /remindme seguito da un'espressione temporale (es: /remindme tra 10 minuti)",
        { reply_to_message_id: ctx.msg.message_id },
      );
      return;
    }

    remindAt = parseTime(commandMatch);

    if (!remindAt) {
      await ctx.reply(
        "Non riesco a capire quando vuoi essere ricordato. Prova con un'espressione come 'tra 5 minuti', 'domani alle 15', 'lunedì prossimo', ecc.",
        { reply_to_message_id: ctx.msg.message_id },
      );
      return;
    }
  }

  if (remindAt <= new Date()) {
    await ctx.reply(
      "Il tempo specificato è nel passato. Specifica un momento futuro.",
      { reply_to_message_id: ctx.msg.message_id },
    );
    return;
  }

  try {
    const reminderId = reminders.create({
      chatId: ctx.chat.id,
      userId: ctx.from.id,
      messageId: ctx.msg.message_id,
      replyToMessageId,
      reminderText,
      remindAt,
    });

    const formattedDate = remindAt.toLocaleString("it-IT", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const messageLink = replyToMessageId
      ? `https://t.me/c/${ctx.chat.id.toString().replace("-100", "")}/${replyToMessageId}`
      : `https://t.me/c/${ctx.chat.id.toString().replace("-100", "")}/${ctx.msg.message_id}`;

    await ctx.reply(
      `✅ Promemoria impostato per ${formattedDate}\n📎 [Link al messaggio](${messageLink})`,
      {
        reply_to_message_id: ctx.msg.message_id,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      },
    );
  } catch (error) {
    console.error("Error creating reminder:", error);
    await ctx.reply(
      "Si è verificato un errore nel creare il promemoria. Riprova più tardi.",
      { reply_to_message_id: ctx.msg.message_id },
    );
  }
}

async function remindMeInReply(ctx: Context) {
  if (!ctx.msg?.reply_to_message) {
    return;
  }

  const fakeMatch = ["", ""] as RegExpMatchArray;
  const hearsCtx = ctx as HearsContext<Context>;
  hearsCtx.match = fakeMatch;

  await remindMeCommand(hearsCtx);
}

export const remindersComposer = new Composer();

remindersComposer.hears(/^[/!]remindme$/i, middlewareFactory(remindMeInReply));
remindersComposer.hears(
  /^[/!]remindme(?:@\w+)?\s+(.+)/i,
  middlewareFactory(remindMeCommand),
);
