import type { Bot } from "grammy";
import { db } from "@/database/database";
import { Reminders } from "./Reminders";

const reminders = new Reminders(db);
let checkInterval: Timer | null = null;

export function startReminderChecker(bot: Bot) {
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  async function checkAndSendReminders() {
    try {
      const pendingReminders = reminders.getPendingReminders();

      for (const reminder of pendingReminders) {
        try {
          const messageLink = reminder.reply_to_message_id
            ? `https://t.me/c/${reminder.chat_id.toString().replace("-100", "")}/${reminder.reply_to_message_id}`
            : reminder.message_id
              ? `https://t.me/c/${reminder.chat_id.toString().replace("-100", "")}/${reminder.message_id}`
              : null;

          let message = `🔔 **Promemoria!**\n`;

          if (reminder.reminder_text) {
            message += `\n📝 ${reminder.reminder_text}\n`;
          }

          if (messageLink) {
            message += `\n📎 [Messaggio originale](${messageLink})`;
          }

          await bot.api.sendMessage(reminder.chat_id, message, {
            reply_to_message_id: reminder.reply_to_message_id || undefined,
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          });

          reminders.markAsSent(reminder.id);
        } catch (error) {
          console.error(`Failed to send reminder ${reminder.id}:`, error);

          if (
            error instanceof Error &&
            error.message.includes("message to reply not found")
          ) {
            reminders.markAsSent(reminder.id);
          }
        }
      }
    } catch (error) {
      console.error("Error checking reminders:", error);
    }
  }

  checkAndSendReminders();

  checkInterval = setInterval(checkAndSendReminders, 30000);

  console.log("Reminder checker started (checking every 30 seconds)");
}

export function stopReminderChecker() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log("Reminder checker stopped");
  }
}
