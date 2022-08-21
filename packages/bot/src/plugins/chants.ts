import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import { decode } from "windows-1252";
import { randInt, randomChoice } from "./utils/random";

const url = (n: number, team: string) => {
  return `https://www.coridastadio.com/tifoseria/loadmore.asp?PagePosition=${n}&filtrosquadra=${team}`;
};

interface Chant {
  team: string;
  text: string;
}

const getChants = async (team: string): Promise<Chant[]> => {
  const res = await request(url(randInt(1, 1000), team), {
    headers: {
      referer: "https://www.coridastadio.com",
    },
  });
  const text = await res.body.text();
  const decodedText = decode(text);
  const root = parse(decodedText);
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
    const team = match[1].trim();
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
