import * as fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { randomChoice } from "./utils/random";

class Markov {
  path: string;
  corpus: object;
  constructor(filePath: string) {
    this.path = filePath;
    this.corpus = {};
    this.initialize();
  }

  processSentence(sentence: string): void {
    // find follow up of pairs of words
    // i.e. w1 w2 => w3
    //      w2 w3 => w4
    const words = sentence.split(" ");
    if (words.length === 1) return;
    for (let i = 0; i < words.length - 2; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      const w3 = words[i + 2];
      if (this.corpus[`${w1} ${w2}`] !== undefined) {
        if (this.corpus[`${w1} ${w2}`][w3] !== undefined) {
          this.corpus[`${w1} ${w2}`][w3] = this.corpus[`${w1} ${w2}`][w3] + 1;
        } else {
          this.corpus[`${w1} ${w2}`][w3] = 1;
        }
      } else {
        this.corpus[`${w1} ${w2}`] = {};
        this.corpus[`${w1} ${w2}`][w3] = 1;
      }
    }
  }

  calcProbs(): void {
    // calculate cumulative distribution
    for (let key in this.corpus) {
      let total = 0;
      let keys = Object.keys(this.corpus[key]);
      keys.forEach(k => (total += this.corpus[key][k]));
      let cum = 1;
      const cumDensArr = keys.map(k => {
        cum -= this.corpus[key][k] / total;
        let prob = cum;
        return { word: k, prob: prob };
      });
      this.corpus[key] = cumDensArr;
    }
  }

  initialize(): void {
    // only get last 1000kb
    const stats = fs.statSync(this.path);
    const fileSizeInBytes = stats.size;
    const stream = fs.createReadStream(this.path, {
      start: fileSizeInBytes - 1000000 <= 0 ? 0 : fileSizeInBytes - 1000000,
      end: fileSizeInBytes,
    });

    // create markov corpus
    let data = "";
    stream.on("data", chunk => {
      data += chunk;
    });

    stream.on("end", () => {
      const sentences = data.split("\n");
      sentences.forEach(s => {
        this.processSentence(s);
      });
      this.calcProbs();
    });

    stream.on("error", function (err) {
      console.error(err.stack);
    });
  }

  findNext(currWord: string): string {
    // find word from CDF
    // e.g. [{word:"you", prob:0.9}, {word:"me", prob:0.6}]
    // random = 0.7 => return me (between 0.6 and 0.9)
    return this.corpus[currWord].find(next => Math.random() >= next.prob).word;
  }

  makeChain(start: string, limit = 100): string {
    let currWord = start;
    let sentence = [start];
    for (let i = 0; i < limit; i++) {
      if (this.corpus[currWord] === undefined) {
        break;
      }
      let nextWord = this.findNext(currWord);
      if (nextWord === "\n") {
        break;
      } else {
        sentence.push(nextWord);
        // build pair of words
        currWord = `${currWord.split(" ")[1]} ${nextWord}`;
      }
    }
    if (sentence.length > 4) {
      return sentence.join(" ");
    } else {
      return this.makeChain(start, limit);
    }
  }

  get randomKey(): string {
    return randomChoice(Object.keys(this.corpus));
  }

  makeRandomChain(): string {
    return this.makeChain(this.randomKey);
  }
}

export default {
  Markov: Markov,
  reply:
    (bot: TelegramBot, markov: Markov) =>
    (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
      const matched = match[1].split(" ");
      const w2 = matched.pop();
      const w1 = matched.pop();
      const message = markov.makeChain(`${w1} ${w2}`);
      bot.sendMessage(msg.chat.id, `${matched.join(" ")} ${message}`);
    },
  random:
    (bot: TelegramBot, markov: Markov) =>
    (msg: TelegramBot.Message): void => {
      const message = markov.makeRandomChain();
      bot.sendMessage(msg.chat.id, message);
    },
};
