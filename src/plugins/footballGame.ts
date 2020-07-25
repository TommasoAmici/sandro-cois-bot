import axios from 'axios';
import * as TelegramBot from 'node-telegram-bot-api';
import * as utf8 from 'utf8';
import client from '../redisClient';
import { getUsers, prettyPrint } from './stats/print';
const Fuse = require('fuse.js');
//   {
//     item: { type: 'uri', value: 'http://www.wikidata.org/entity/Q1938' },
//     itemLabel: { 'xml:lang': 'en', type: 'literal', value: 'Bacary Sagna' }
//   }

interface WikiFootballDataBinding {
    item: { type: string; value: string };
    itemLabel: { 'xml:lang': string; type: string; value: string };
}

interface WikiFootballData {
    head: { vars: string[] };
    results: { bindings: WikiFootballDataBinding[] };
}

const redisKey = 'football-players';
const redisKeyTeams = 'football-teams';

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `SELECT DISTINCT ?item ?itemLabel WHERE {
    ?item wdt:P106 wd:Q937857.
    VALUES ?participantIn {
      wd:Q30032467
      wd:Q219705
      wd:Q275673
      wd:Q3957172
      wd:Q61686413
    }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
  LIMIT 5000`;
const fullURL = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);

const build = (bot: TelegramBot) => (msg: TelegramBot.Message) => {
    client.del(redisKey);
    axios
        .get(fullURL, {
            headers: { Accept: 'application/sparql-results+json' },
        })
        .then((res) => {
            const data: WikiFootballData = res.data;
            console.log(data.results.bindings[0]);
            data.results.bindings.forEach((b) => {
                const ID = b.item.value.replace(
                    'http://www.wikidata.org/entity/',
                    ''
                );
                client.sadd(
                    redisKey,
                    `${utf8.encode(b.itemLabel.value)}:${ID}`
                );
            });
            bot.sendMessage(msg.chat.id, 'Il gioco è pronto');
        })
        .catch((err) => bot.sendMessage(msg.chat.id, err));
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

    const res = await axios.get(queryURL(teamID));
    const data: WikiFootballDataTeam = res.data;
    const teamName = data.entities[teamID].labels.en.value;
    // store in cache
    client.hset(redisKeyTeams, teamID, teamName);
    return teamName;
};

const queryURL = (id: string) => `http://www.wikidata.org/entity/${id}.json`;

const getYear = (prop) => {
    if (prop === undefined || prop.length === 0) return '?';
    if (prop[0].datavalue === undefined) return '?';
    const year = new Date(
        prop[0].datavalue.value.time.replace('+', '')
    ).getFullYear();
    if (isNaN(year)) return '?';
    return year;
};

const getAmount = (prop) => {
    if (prop === undefined || prop.length === 0) return '?';
    return parseInt(prop[0].datavalue.value.amount);
};

const allTeams = async (teams) => {
    let clubObjects = [];
    let nationalObjects = [];
    for (const t of teams) {
        if (t.qualifiers === undefined) continue;
        const teamID = t.mainsnak.datavalue.value.id;
        const teamName = await getTeamName(teamID);
        const startDate = getYear(t.qualifiers['P580']);
        const endDate = getYear(t.qualifiers['P582']);
        const numMatches = getAmount(t.qualifiers['P1350']);
        const numGoals = getAmount(t.qualifiers['P1351']);
        const teamString = `${startDate}-${endDate} ${teamName} - ${numMatches} (${numGoals})\n`;
        if (teamName.includes('national')) {
            nationalObjects.push({ teamString, startDate });
        } else {
            clubObjects.push({ teamString, startDate });
        }
    }
    const clubsSorted = clubObjects.sort((a, b) => a.startDate - b.startDate);
    const nationalSorted = nationalObjects.sort(
        (a, b) => a.startDate - b.startDate
    );
    return [
        ...clubsSorted.map((s) => s.teamString),
        '\n',
        ...nationalSorted.map((s) => s.teamString),
    ];
};

const play = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const randomPlayer = await client.spop(redisKey);
    const randomPlayerName = utf8.decode(randomPlayer.split(':')[0]);
    const randomPlayerID = randomPlayer.split(':')[1];

    const res = await axios.get(queryURL(randomPlayerID));
    const data = res.data;
    const teams = data.entities[randomPlayerID].claims['P54'];
    const teamsFormatted = await allTeams(teams);

    bot.sendMessage(msg.chat.id, teamsFormatted.join(''));

    client.set(`${msg.chat.id}:solution`, randomPlayerName);
};

const solution = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const s = await client.get(`${msg.chat.id}:solution`);
    client.set(`${msg.chat.id}:solution`, null);
    bot.sendMessage(msg.chat.id, s);
};

const winner = (bot: TelegramBot) => async (
    msg: TelegramBot.Message,
    match: RegExpMatchArray
) => {
    const s = await client.get(`${msg.chat.id}:solution`);
    const options = {
        includeScore: true,
    };

    const fuse = new Fuse([s], options);

    const result = fuse.search(match[1]);
    if (result[0] === undefined) {
        if (
            ['smith', 'inho', 'sson', 'escu', 'mohamed'].includes(
                match[1].toLowerCase()
            )
        ) {
            bot.sendMessage(msg.chat.id, 'Vergognati!');
        } else bot.sendMessage(msg.chat.id, 'No');
    } else if (result[0].score < 0.3) {
        if (match[1].length / s.length < 0.2) {
            bot.sendMessage(msg.chat.id, 'Non ci provare');
        } else {
            const key = `chat:${msg.chat.id}:user:${msg.from.id}`;
            client.hincrby(key, 'football-game', 1);
            client.set(`${msg.chat.id}:solution`, null);
            bot.sendMessage(
                msg.chat.id,
                `@${msg.from.username} ha indovinato: ${s}`
            );
        }
    }
};

const ranking = (bot: TelegramBot) => async (
    msg: TelegramBot.Message
): Promise<void> => {
    const users = await getUsers(msg.chat.id, 'football-game');
    const sortedUsers = users.sort((a, b) => b.count - a.count);
    const message = prettyPrint(sortedUsers);
    bot.sendMessage(msg.chat.id, message);
};

export default { build, play, solution, winner, ranking };
