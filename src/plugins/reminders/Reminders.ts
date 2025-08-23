import type { Database } from "bun:sqlite";

export interface Reminder {
  id: number;
  chat_id: number;
  user_id: number;
  message_id: number | null;
  reply_to_message_id: number | null;
  reminder_text: string | null;
  remind_at: string;
  created_at: string;
  sent: boolean;
  sent_at: string | null;
}

export interface CreateReminderOptions {
  chatId: number;
  userId: number;
  messageId?: number;
  replyToMessageId?: number;
  reminderText?: string;
  remindAt: Date;
}

export class Reminders {
  constructor(private db: Database) {}

  create(options: CreateReminderOptions): number {
    const query = this.db.prepare<
      { id: number },
      {
        $chat_id: number;
        $user_id: number;
        $message_id: number | null;
        $reply_to_message_id: number | null;
        $reminder_text: string | null;
        $remind_at: string;
      }
    >(
      `INSERT INTO reminders (chat_id, user_id, message_id, reply_to_message_id, reminder_text, remind_at)
       VALUES ($chat_id, $user_id, $message_id, $reply_to_message_id, $reminder_text, $remind_at)
       RETURNING id`,
    );

    const result = query.get({
      $chat_id: options.chatId,
      $user_id: options.userId,
      $message_id: options.messageId ?? null,
      $reply_to_message_id: options.replyToMessageId ?? null,
      $reminder_text: options.reminderText ?? null,
      $remind_at: options.remindAt.toISOString(),
    });

    if (!result) {
      throw new Error("Failed to create reminder");
    }

    return result.id;
  }

  getPendingReminders(limit = 100): Reminder[] {
    const query = this.db.prepare<Reminder, { $now: string; $limit: number }>(
      `SELECT * FROM reminders
       WHERE sent = FALSE AND remind_at <= $now
       ORDER BY remind_at ASC
       LIMIT $limit`,
    );

    return query.all({
      $now: new Date().toISOString(),
      $limit: limit,
    });
  }

  markAsSent(id: number): void {
    const query = this.db.prepare<null, { $id: number; $sent_at: string }>(
      `UPDATE reminders
       SET sent = TRUE, sent_at = $sent_at
       WHERE id = $id`,
    );

    query.run({
      $id: id,
      $sent_at: new Date().toISOString(),
    });
  }

  getById(id: number): Reminder | null {
    const query = this.db.prepare<Reminder, { $id: number }>(
      `SELECT * FROM reminders WHERE id = $id`,
    );

    return query.get({ $id: id });
  }

  getUserReminders(chatId: number, userId: number, limit = 10): Reminder[] {
    const query = this.db.prepare<
      Reminder,
      { $chat_id: number; $user_id: number; $limit: number }
    >(
      `SELECT * FROM reminders
       WHERE chat_id = $chat_id AND user_id = $user_id AND sent = FALSE
       ORDER BY remind_at ASC
       LIMIT $limit`,
    );

    return query.all({
      $chat_id: chatId,
      $user_id: userId,
      $limit: limit,
    });
  }

  deleteReminder(id: number): boolean {
    const query = this.db.prepare<null, { $id: number }>(
      `DELETE FROM reminders WHERE id = $id AND sent = FALSE`,
    );

    const result = query.run({ $id: id });
    return result.changes > 0;
  }
}
