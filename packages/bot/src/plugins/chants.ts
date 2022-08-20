import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { request } from "undici";
import { randomChoice } from "./utils/random";

const url = "https://www.coridastadio.com/migliori";

interface Chant {
  team: string;
  text: string;
}

const getChants = async (): Promise<Chant[]> => {
  const res = await request(url);
  const text = await res.body.text();
  const root = parse(text);
  const chantsEls = root.querySelectorAll(".coro");
  return chantsEls.map(c => {
    return {
      team: c.querySelector("a.titolocoro").textContent,
      text: c.querySelector(".testomessaggio").textContent,
    };
  });
};

const formatChant = (chant: Chant) => `**${chant.team}**\n\n${chant.text}`;

export const randomChant =
  (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const chants = await getChants();
    bot.sendMessage(msg.chat.id, formatChant(randomChoice(chants)), {
      parse_mode: "MarkdownV2",
    });
  };
