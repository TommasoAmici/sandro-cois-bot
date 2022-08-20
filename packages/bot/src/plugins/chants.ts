import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import { randInt, randomChoice } from "./utils/random";

const url = (n: number) =>
  `https://www.coridastadio.com/tifoseria/loadmore.asp?PagePosition=${n}`;

interface Chant {
  team: string;
  text: string;
}

const getChants = async (): Promise<Chant[]> => {
  const res = await request(url(randInt(1, 1000)), {
    headers: { referer: "https://www.coridastadio.com" },
  });
  const text = await res.body.text();
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
  (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const chants = await getChants();
    bot.sendMessage(msg.chat.id, formatChant(randomChoice(chants)), {
      parse_mode: "HTML",
    });
  };
