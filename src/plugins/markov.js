const fs = require("fs");
const utils = require("./utils");

class Markov {
  constructor(filePath) {
    this.path = filePath;
    this.corpus = {};
    this.initialize();
  }

  processSentence(sentence) {
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

  calcProbs() {
    // calculate cumulative distribution
    for (const key in this.corpus) {
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

  initialize() {
    // only get last 1000kb
    const stats = fs.statSync(this.path);
    const fileSizeInBytes = stats.size;
    const stream = fs.createReadStream(this.path, {
      start: fileSizeInBytes - 1000000 <= 0 ? 0 : fileSizeInBytes - 1000000,
      end: fileSizeInBytes
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

    stream.on("error", function(err) {
      console.error(err.stack);
    });
  }

  findNext(currWord) {
    // find word from CDF
    // e.g. [{word:"you", prob:0.9}, {word:"me", prob:0.6}]
    // random = 0.7 => return me (between 0.6 and 0.9)
    return this.corpus[currWord].find(next => Math.random() >= next.prob).word;
  }

  makeChain(start, limit = 100) {
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

  get randomKey() {
    return utils.randomChoice(Object.keys(this.corpus));
  }

  makeRandomChain() {
    return this.makeChain(this.randomKey);
  }
}

module.exports = {
  Markov: Markov,
  reply: (bot, markov) => (msg, match) => {
    const chatId = msg.chat.id;
    const matched = match[1].split(" ");
    const w2 = matched.pop();
    const w1 = matched.pop();
    const message = markov.makeChain(`${w1} ${w2}`);
    bot.sendMessage(chatId, `${matched.join(" ")} ${message}`);
  },
  random: (bot, markov) => msg => {
    const chatId = msg.chat.id;
    const message = markov.makeRandomChain();
    bot.sendMessage(chatId, message);
  }
};