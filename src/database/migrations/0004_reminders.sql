-- Table to store reminders
CREATE TABLE reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message_id INTEGER,
  reply_to_message_id INTEGER,
  reminder_text TEXT,
  remind_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP
);

-- Index for efficient querying of pending reminders
CREATE INDEX idx_reminders_pending ON reminders(remind_at, sent) WHERE sent = FALSE;
-- Index for chat-specific reminders
CREATE INDEX idx_reminders_chat ON reminders(chat_id, user_id);