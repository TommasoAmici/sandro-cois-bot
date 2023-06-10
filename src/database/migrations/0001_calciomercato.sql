-- a table to store the articles that have been sent to a chat
-- to avoid sending duplicates
CREATE TABLE calciomercato (
  chat_id INTEGER NOT NULL,
  article_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
