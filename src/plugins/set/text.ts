import type { Context, HearsContext } from "grammy";

import { db } from "@/database/database";
import { SetType, setTypes } from "./enum";

/**
 * Usage: /set <key> <value>
 * Sets a text key to a value. The value is returned whenever a message
 * starts with the key.
 */
export async function setCommand(ctx: HearsContext<Context>) {
  const setQuery = db.query<
    null,
    {
      $chat_id: number;
      $user_id: number | null;
      $type: SetType;
      $key: string;
      $value: string;
    }
  >(
    `INSERT INTO sets (chat_id, user_id, type, key, value)
      VALUES ($chat_id, $user_id, $type, $key, $value);`,
  );

  const key = ctx.match[1];
  const val = ctx.match[2];
  try {
    setQuery.run({
      $chat_id: ctx.chat.id,
      $key: key,
      $value: val,
      $type: setTypes.text,
      $user_id: ctx.from?.id ?? null,
    });
  } catch (error) {
    await ctx.reply(`Couldn't set ${key} :(`);
  }
  const message = `${key} => ${val}`;
  await ctx.reply(message);
}

/**
 * Usage: /unset <key>
 * Removes the value associated with the key.
 */
export async function unsetCommand(ctx: HearsContext<Context>) {
  const unsetCommandQuery = db.query(
    "DELETE FROM sets WHERE chat_id = ? AND type = ? AND key = ?;",
  );

  const key = ctx.match[1];
  try {
    unsetCommandQuery.run(ctx.chat.id, setTypes.text, key);
  } catch (error) {
    await ctx.reply(`Couldn't unset ${key} :(`);
  }
  const message = `Unset ${key}`;
  await ctx.reply(message);
}

/**
 * Checks if a message starts with a text key and replies with the value.
 */
export async function getCommand(ctx: HearsContext<Context>) {
  const getCommandQuery = db.query(
    "SELECT value FROM sets WHERE chat_id = ? AND type = ? AND key = ?;",
  );

  const key = ctx.match[0];
  const value = getCommandQuery.get(ctx.chat.id, setTypes.text, key);
  if (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    typeof value.value === "string"
  ) {
    await ctx.reply(value.value);
  }
}

/**
 * Usage: /setlist
 * Returns a list of all text keys in the current chat.
 */
export async function setListCommand(ctx: HearsContext<Context>) {
  const setListCommandQuery = db.query(
    "SELECT key FROM sets WHERE chat_id = ? AND type = ?;",
  );
  const keys = setListCommandQuery.all(ctx.chat.id, setTypes.text);
  if (!Array.isArray(keys)) {
    throw new Error("keys is not an array");
  }
  const text = keys
    .map((key) => {
      if (
        typeof key === "object" &&
        key !== null &&
        "key" in key &&
        typeof key.key === "string"
      ) {
        return key.key;
      }
      return "";
    })
    .join("\n");
  await ctx.reply(text);
}
