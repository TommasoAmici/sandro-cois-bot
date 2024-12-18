DELETE FROM sets WHERE rowid NOT IN (
  SELECT rowid FROM sets GROUP BY chat_id, type, key HAVING COUNT(*) < 2

  UNION

  SELECT
    MAX(rowid) OVER(PARTITION BY chat_id, type, key)
  FROM sets
  WHERE key IN (
    SELECT key
    FROM sets
    GROUP BY chat_id, type, key
    HAVING COUNT(*) > 1
  )
);

CREATE UNIQUE INDEX sets_unique_idx ON sets (chat_id, type, key);
