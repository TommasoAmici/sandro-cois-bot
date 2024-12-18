import { db } from "@/database/database";
import type { User } from "grammy/types";

export function upsertUser(user: User | undefined) {
  if (user?.id === undefined) {
    return;
  }

  const query = db.query(
    `
    INSERT INTO users (id, first_name, username)
    VALUES(?1, ?2, ?3)
    ON CONFLICT(id) DO UPDATE
    SET first_name = excluded.first_name, username = excluded.username;`,
  );
  query.run(user.id, user?.first_name ?? null, user?.username ?? null);
}
