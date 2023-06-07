import { db } from "@/database/database";
import { migrate } from "@/database/migrate";
import { insertQuote } from "@/plugins/quotes";
import { SetType, mediaTypes } from "@/plugins/set/enum";
import Redis from "ioredis";

const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? "6379");

async function importUsers() {
  const client = new Redis({
    port: REDIS_PORT,
  });
  console.log("importing users");
  console.time("imported users");
  const _keys = await client.keys("chat:*:user:*");
  const keys = _keys.filter(k => !k.includes("bestemmie"));
  const insertUser = db.query(`
    INSERT INTO users (id, first_name, username)
    VALUES ($id, $username, $username)
    ON CONFLICT (id) DO UPDATE
    SET first_name = $username,
        username = $username;
  `);
  const insertStats = db.query(`
    INSERT INTO stats (chat_id, user_id, messages_count)
    VALUES ($chat_id, $id, $messages_count)
  `);
  for (const key of keys) {
    const chatID = parseInt(key.split(":")[1]);
    const userID = parseInt(key.split(":")[3]);
    const user = await client.hgetall(key);
    insertUser.run({
      $id: userID,
      $username: user.name ?? "",
    });
    insertStats.run({
      $chat_id: chatID,
      $id: userID,
      $messages_count: parseInt(user.stats),
    });
  }
  console.timeEnd("imported users");
}

async function importBestemmie() {
  const client = new Redis({
    port: REDIS_PORT,
  });

  console.log("importing bestemmie");
  console.time("imported bestemmie");
  const keys = await client.keys("chat:*:user:*:bestemmie");
  const insertQuery = db.query(`
    INSERT INTO bestemmie (chat_id, user_id, body, count)
    VALUES ($chat_id, $user_id, $body, $count)
  `);
  for (const key of keys) {
    const chatID = parseInt(key.split(":")[1]);
    const userID = parseInt(key.split(":")[3]);
    const bestemmie = await client.hgetall(key);
    for (const [key, value] of Object.entries(bestemmie)) {
      insertQuery.run({
        $chat_id: chatID,
        $user_id: userID,
        $body: key,
        $count: parseInt(value),
      });
    }
  }
  console.timeEnd("imported bestemmie");
}

async function importLoveHate() {
  const client = new Redis({
    port: REDIS_PORT,
  });

  console.log("importing hate");
  console.time("imported hate");
  const chatsHate = await client.keys("chat:*:merda");
  const insertHate = db.query(`
    INSERT INTO love_hate (chat_id, body, hate)
    VALUES ($chat_id, $body, $value)
  `);
  for (const chatHate of chatsHate) {
    const chatID = parseInt(chatHate.split(":")[1]);
    const hate = await client.hgetall(chatHate);
    for (const [key, value] of Object.entries(hate)) {
      insertHate.run({
        $chat_id: chatID,
        $body: key,
        $value: parseInt(value),
      });
    }
  }
  console.timeEnd("imported hate");

  console.log("importing love");
  console.time("imported love");
  const chatsLove = await client.keys("chat:*:amore");
  const insertLove = db.query(`
    INSERT INTO love_hate (chat_id, body, love)
    VALUES ($chat_id, $body, $value)
    ON CONFLICT (chat_id, user_id, body) DO UPDATE
    SET love = $value;
  `);
  for (const chatLove of chatsLove) {
    const chatID = parseInt(chatLove.split(":")[1]);
    const love = await client.hgetall(chatLove);
    for (const [key, value] of Object.entries(love)) {
      insertLove.run({
        $chat_id: chatID,
        $body: key,
        $value: parseInt(value),
      });
    }
  }
  console.timeEnd("imported love");
}

async function importQuotes() {
  const client = new Redis({
    port: REDIS_PORT,
  });

  console.log("importing quotes");
  console.time("imported quotes");
  const quotes = await client.keys("chat:*:quotes:*");
  for (const quoteKey of quotes) {
    const chatID = parseInt(quoteKey.split(":")[1]);
    const quote = await client.hgetall(quoteKey);
    let body = quote.body;
    if (quote.author) {
      body += `\n- ${quote.author}`;
    }
    // console.log(body);
    if (quote.date) {
      const createdAt = quote.date;
      let parsedDate: Date | null = null;
      if (createdAt.includes("/")) {
        const year = parseInt(createdAt.split("/")[2]);
        const month = parseInt(createdAt.split("/")[1]);
        const day = parseInt(createdAt.split("/")[0]);
        parsedDate = new Date(year, month - 1, day, 0, 0, 0);
      } else if (createdAt.includes("-")) {
        const year = parseInt(createdAt.split("-")[0]);
        const month = parseInt(createdAt.split("-")[1]);
        const day = parseInt(createdAt.split("-")[2]);
        parsedDate = new Date(year, month - 1, day, 0, 0, 0);
      }
      insertQuote(chatID, body, null, null, true, parsedDate?.toISOString());
    } else {
      insertQuote(chatID, body, null, null);
    }
  }
  console.timeEnd("imported quotes");
}

async function importMedia() {
  const client = new Redis({
    port: REDIS_PORT,
  });

  const query = db.query<
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

  async function importGeneric(pattern: string, type: SetType) {
    const chats = await client.keys(pattern);
    for (const chat of chats) {
      console.log("importing stickers for %s", chat);
      const chatID = parseInt(chat.split(":")[1]);
      const media = await client.hgetall(chat);
      for (const [key, value] of Object.entries(media)) {
        query.run({
          $chat_id: chatID,
          $type: type,
          $key: key,
          $value: value,
          $user_id: null,
        });
      }
    }
  }

  const importText = () => importGeneric("chat:*:text", mediaTypes.text.type);
  const importGifs = () => importGeneric("chat:*:gifs", mediaTypes.gifs.type);
  const importStickers = () =>
    importGeneric("chat:*:stickers", mediaTypes.stickers.type);
  const importPhotos = () =>
    importGeneric("chat:*:photos", mediaTypes.photos.type);

  console.log("importing text");
  console.time("imported text");
  await importText();
  console.timeEnd("imported text");

  console.log("importing gifs");
  console.time("imported gifs");
  await importGifs();
  console.timeEnd("imported gifs");

  console.log("importing stickers");
  console.time("imported stickers");
  await importStickers();
  console.timeEnd("imported stickers");

  console.log("importing photos");
  console.time("imported photos");
  await importPhotos();
  console.timeEnd("imported photos");
}

const main = async () => {
  await migrate(db);
  await importUsers();
  await importBestemmie();
  await importQuotes();
  await importMedia();
  await importLoveHate();
};

await main();
process.exit(0);
