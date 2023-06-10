import { Context, HearsContext } from "grammy";
import { parse } from "node-html-parser";
import { randInt, randomChoice } from "./utils/random";

const baseURL = "https://www.coridastadio.com/tifoseria/loadmore.asp";

interface Chant {
  team: string;
  text: string;
}

const getChants = async (team: string, retries = 3): Promise<Chant[]> => {
  const page = team === undefined ? randInt(1, 1000) : randInt(1, 100);

  const params = new URLSearchParams();
  params.set("PagePosition", page.toString());
  params.set("filtrosquadra", team);

  const res = await fetch(`${baseURL}?${params.toString()}`, {
    headers: {
      referer: "https://www.coridastadio.com",
    },
  });

  const text = await res.text();
  const notFound =
    res.status === 404 || text.includes("404 Not Found") || text === "";

  if (retries > 0 && notFound) {
    return getChants(team, retries - 1);
  }
  const root = parse(text);
  const chantsEls = root.querySelectorAll(".coro");
  const _chants = chantsEls.map((c) => {
    return {
      team: c.querySelector("a.titolocoro")?.textContent,
      text: c
        .querySelector(".testomessaggio")
        ?.innerHTML.replaceAll("<br>", "\n"),
    };
  });
  return _chants.filter(
    (c): c is Chant => c.team !== undefined && c.text !== undefined,
  );
};

const formatChant = (chant: Chant) =>
  `<strong>${chant.team}</strong>\n\n${chant.text}`;

export const randomChant = async (ctx: HearsContext<Context>) => {
  const team = ctx.match[1]?.trim();

  const chants = await getChants(team);
  if (chants.length === 0) {
    await ctx.reply("No chants found");
    return;
  }
  const chant = formatChant(randomChoice(chants));

  await ctx.reply(chant, {
    parse_mode: "HTML",
  });
};
