BEGIN;
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  first_name TEXT,
  username TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE stats (
  chat_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  messages_count INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(chat_id, user_id)
);
CREATE TABLE sets (
  chat_id INTEGER NOT NULL,
  type INTEGER NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  -- user_id of who added the media set
  user_id INTEGER
);
CREATE TABLE love_hate (
  chat_id INTEGER NOT NULL,
  user_id INTEGER NULL,
  body TEXT NOT NULL,
  love INTEGER NOT NULL DEFAULT 0,
  hate INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(chat_id, user_id, body)
);
CREATE TABLE quotes (
  chat_id INTEGER NOT NULL,
  user_id INTEGER,
  author_id INTEGER,
  body TEXT NOT NULL,
  show_date BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE VIRTUAL TABLE quotes_search USING fts5(
  chat_id,
  quote_id,
  author,
  body,
  tokenize = "trigram"
);
CREATE TABLE bestemmie (
  chat_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
COMMIT;
