import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import { randInt, randomChoice } from "./utils/random";

const baseURL = `https://www.coridastadio.com/tifoseria/loadmore.asp`;

interface Chant {
  team: string;
  text: string;
}

const getChants = async (team: string, retries = 3): Promise<Chant[]> => {
  const page = team === undefined ? randInt(1, 1000) : randInt(1, 100);

  const res = await request(baseURL, {
    headers: {
      referer: "https://www.coridastadio.com",
    },
    query: {
      PagePosition: page,
      filtrosquadra: team,
    },
  });

  const text = await res.body.text();
  const notFound =
    res.statusCode === 404 || text.includes("404 Not Found") || text === "";

  if (retries > 0 && notFound) {
    return getChants(team, retries - 1);
  }
  const root = parse(text);
  const chantsEls = root.querySelectorAll(".coro");
  return [
    ...new Set(
      chantsEls.map(c => {
        return {
          team: c.querySelector("a.titolocoro").textContent,
          text: c
            .querySelector(".testomessaggio")
            .innerHTML.replaceAll("<br>", "\n"),
        };
      }),
    ),
  ];
};

const formatChant = (chant: Chant) =>
  `<strong>${chant.team}</strong>\n\n${chant.text}`;

export const randomChant =
  (bot: TelegramBot) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray) => {
    const team = match[1]?.trim();
    let chant = "";
    try {
      const chants = await getChants(team);
      chant = formatChant(randomChoice(chants));
    } catch (error) {
      console.error("failed to send chant");
      return;
    }

    bot.sendMessage(msg.chat.id, chant, {
      parse_mode: "HTML",
    });
  };
