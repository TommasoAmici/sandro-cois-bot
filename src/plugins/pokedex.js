const utils = require("./utils");
const Pokedex = require("pokedex");
const pokedex = new Pokedex();

const makeCaption = pokemon =>
  `#${pokemon.id} ${utils.toTitleCase(pokemon.name)}\nHeight: ${pokemon.height /
    10} m\nWeight: ${pokemon.weight / 10} kg`;

const pokedexByName = bot => (msg, match) => {
  const pokemon = pokedex.pokemon(match[1].toLowerCase());
  bot.sendVideo(msg.chat.id, pokemon.sprites.animated, {
    caption: makeCaption(pokemon)
  });
};

const pokedexById = bot => (msg, match) => {
  const pokemon = pokedex.pokemon(+match[1]);
  bot.sendVideo(msg.chat.id, pokemon.sprites.animated, {
    caption: makeCaption(pokemon)
  });
};

module.exports = { byId: pokedexById, byName: pokedexByName };
