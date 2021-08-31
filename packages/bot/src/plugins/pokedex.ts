const Pokedex = require("pokedex");
import * as TelegramBot from "node-telegram-bot-api";

import utils from "./utils";

const pokedex = new Pokedex();

const makeCaption = (pokemon): string =>
  `#${pokemon.id} ${utils.toTitleCase(pokemon.name)}\nHeight: ${
    pokemon.height / 10
  } m\nWeight: ${pokemon.weight / 10} kg`;

const pokedexByName =
  (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    const pokemon = pokedex.pokemon(match[1].toLowerCase());
    bot.sendVideo(msg.chat.id, pokemon.sprites.animated, {
      caption: makeCaption(pokemon),
    });
  };

const pokedexById =
  (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    const pokemon = pokedex.pokemon(+match[1]);
    bot.sendVideo(msg.chat.id, pokemon.sprites.animated, {
      caption: makeCaption(pokemon),
    });
  };

export default { byId: pokedexById, byName: pokedexByName };
