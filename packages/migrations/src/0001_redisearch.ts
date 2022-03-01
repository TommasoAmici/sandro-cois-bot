import * as Redis from "ioredis";

const authorRegex = /\n*[-–—] ?(.+)$/;

const main = async () => {
  const client = new Redis();

  const quoteSets = await client.keys("chat:*:quotes");
  quoteSets.forEach(async quoteSet => {
    const quotes = await client.smembers(quoteSet);
    await client.del(quoteSet);
    quotes.forEach(async quote => {
      const quoteID = await client.incr("quotes-id");
      client.zadd(quoteSet, Date.now(), quoteID);
      const author = quote.match(authorRegex);
      client.hset(
        `${quoteSet}:${quoteID}`,
        "body",
        quote.replace(authorRegex, ""),
        "author",
        author !== null ? author[1] : "",
        "id",
        quoteID,
      );
    });
    client
      .send_command(
        "FT.CREATE",
        quoteSet.replace(":quotes", ":quotes-index"),
        "ON",
        "HASH",
        "PREFIX",
        1,
        `${quoteSet}:`,
        "SCHEMA",
        "body",
        "TEXT",
        "author",
        "TEXT",
      )
      .catch(err => console.error(err));
  });
};

main();
