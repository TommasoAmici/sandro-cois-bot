import axios from "axios";
import { remove as removeDiacritics } from "diacritics";
import type { Context, HearsContext } from "grammy";
import { Composer } from "grammy";
import * as utf8 from "utf8";
import client from "../redisClient";
import { getUsers } from "./stats";
import { prettyPrint } from "./utils/printStandings";

const Fuse = require("fuse.js");
//   {
//     item: { type: 'uri', value: 'http://www.wikidata.org/entity/Q1938' },
//     itemLabel: { 'xml:lang': 'en', type: 'literal', value: 'Bacary Sagna' }
//   }

interface WikiFootballDataBinding {
  item: { type: string; value: string };
  itemLabel: { "xml:lang": string; type: string; value: string };
}

interface WikiFootballData {
  head: { vars: string[] };
  results: { bindings: WikiFootballDataBinding[] };
}

const redisKey = "football-players";
const redisKeyTeams = "football-teams";

const endpointUrl = "https://query.wikidata.org/sparql";
const sparqlQuery = `SELECT DISTINCT ?item ?itemLabel WHERE {
    ?item wdt:P106 wd:Q937857.
    VALUES ?participantIn {
      wd:Q15847307 #serie a 2014-2015
      wd:Q19309054 #serie a 2015-2016
      wd:Q23728326 #serie a 2016-2017
      wd:Q28820477 #serie a 2017-2018
      wd:Q48782372 #serie a 2018-2019
    }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
  LIMIT 5000`;
const fullURL = endpointUrl + "?query=" + encodeURIComponent(sparqlQuery);

const build = (ctx: HearsContext<Context>) => {
  client.del(redisKey);
  axios
    .get<WikiFootballData>(fullURL, {
      headers: { Accept: "application/sparql-results+json" },
    })
    .then(res => {
      const data = res.data;
      data.results.bindings.forEach(b => {
        const ID = b.item.value.replace("http://www.wikidata.org/entity/", "");
        client.sadd(redisKey, `${utf8.encode(b.itemLabel.value)}:${ID}`);
      });
      ctx.reply("Il gioco è pronto");
    })
    .catch(err => ctx.reply(err));
};

interface WikiFootballDataTeam {
  entities: {
    [id: string]: {
      labels: {
        en: {
          value: string;
        };
      };
    };
  };
}

const getTeamName = async (teamID: string) => {
  const teamNameCache = await client.hget(redisKeyTeams, teamID);
  if (teamNameCache !== null) return teamNameCache;

  const res = await axios.get<WikiFootballDataTeam>(queryURL(teamID));
  const data = res.data;
  const teamName = data.entities[teamID].labels.en.value;
  // store in cache
  client.hset(redisKeyTeams, teamID, teamName);
  return teamName;
};

const queryURL = (id: string) => `http://www.wikidata.org/entity/${id}.json`;

const getYear = prop => {
  if (prop === undefined || prop.length === 0) return "?";
  if (prop[0].datavalue === undefined) return "?";
  const year = new Date(
    prop[0].datavalue.value.time.replace("+", ""),
  ).getFullYear();
  if (isNaN(year)) return "?";
  return year;
};

const getAmount = prop => {
  if (prop === undefined || prop.length === 0) return "?";
  return parseInt(prop[0].datavalue.value.amount);
};

const allTeams = async teams => {
  let clubObjects = [];
  let nationalObjects = [];
  for (const t of teams) {
    if (t.qualifiers === undefined) continue;
    const teamID = t.mainsnak.datavalue.value.id;
    const teamName = await getTeamName(teamID);
    const startDate = getYear(t.qualifiers["P580"]);
    const endDate = getYear(t.qualifiers["P582"]);
    const numMatches = getAmount(t.qualifiers["P1350"]);
    const numGoals = getAmount(t.qualifiers["P1351"]);
    const teamString = `${startDate}-${endDate} ${teamName} - ${numMatches} (${numGoals})\n`;
    if (teamName.includes("national")) {
      nationalObjects.push({ teamString, startDate });
    } else {
      clubObjects.push({ teamString, startDate });
    }
  }
  const clubsSorted = clubObjects.sort((a, b) => a.startDate - b.startDate);
  const nationalSorted = nationalObjects.sort(
    (a, b) => a.startDate - b.startDate,
  );
  return [
    ...clubsSorted.map(s => s.teamString),
    "\n",
    ...nationalSorted.map(s => s.teamString),
  ];
};

const play = async (ctx: HearsContext<Context>) => {
  const prevSolution = await client.get(`${ctx.chat.id}:solution`);
  const randomPlayer = await client.spop(redisKey);
  const randomPlayerName = utf8.decode(randomPlayer.split(":")[0]);
  const randomPlayerID = randomPlayer.split(":")[1];

  const res = await axios.get<any>(queryURL(randomPlayerID));
  const data = res.data;
  const teams = data.entities[randomPlayerID].claims["P54"];
  const teamsFormatted = await allTeams(teams);

  ctx.reply(teamsFormatted.join(""));
  if (prevSolution !== null) {
    ctx.reply(prevSolution);
  }

  client.set(`${ctx.chat.id}:solution`, randomPlayerName);
};

const surrender = async (ctx: HearsContext<Context>) => {
  const s = await client.get(`${ctx.chat.id}:solution`);
  client.set(`${ctx.chat.id}:solution`, null);
  ctx.reply(s);
};

const solution = async (ctx: HearsContext<Context>) => {
  const solution = await client.get(`${ctx.chat.id}:solution`);
  const normalizedSolution = removeDiacritics(solution);
  const options = {
    includeScore: true,
  };

  const fuse = new Fuse([normalizedSolution], options);

  const result = fuse.search(ctx.match[1]);
  if (result[0] === undefined) {
    if (
      ["smith", "inho", "sson", "escu", "mohamed", "chenko"].includes(
        ctx.match[1].toLowerCase(),
      )
    ) {
      ctx.reply("Vergognati!");
    } else ctx.reply("No");
  } else if (result[0].score < 0.3) {
    if (ctx.match[1].length / solution.length < 0.2) {
      ctx.reply("Non ci provare");
    } else {
      const key = `chat:${ctx.chat.id}:user:${ctx.msg.from.id}`;
      client.hincrby(key, "football-game", 1);
      client.set(`${ctx.chat.id}:solution`, null);
      ctx.reply(`@${ctx.msg.from.username} ha indovinato: ${solution}`);
    }
  }
};

const ranking = async (ctx: HearsContext<Context>) => {
  const users = await getUsers(ctx.chat.id, "football-game");
  const sortedUsers = users.sort((a, b) => b.count - a.count);
  const message = prettyPrint(sortedUsers);
  ctx.reply(message);
};

export const footballGame = new Composer();
footballGame.hears(/^[/!]buildgame(?:@\w+)?$/i, build);
footballGame.hears(/^[/!]trivia(?:@\w+)?$/i, play);
footballGame.hears(/^[/!]surrender(?:@\w+)?$/i, surrender);
footballGame.hears(/^[/!]ranking(?:@\w+)?$/i, ranking);
footballGame.hears(/^[/!]solution(?:@\w+)? ([\s\S]*)/i, solution);
