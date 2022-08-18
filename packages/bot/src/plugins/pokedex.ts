import axios from "axios";
import { Context } from "grammy";
import { toTitleCase } from "./utils";

const getPokemon = async (name: string) => {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return res.data;
};

const makeCaption = (pokemon): string =>
  `#${pokemon.id} ${toTitleCase(pokemon.name)}\nHeight: ${
    parseInt(pokemon.height) / 10
  } m\nWeight: ${parseInt(pokemon.weight) / 10} kg`;

export const pokemonByName = async (ctx: Context) => {
  const pokemon = await getPokemon(ctx.match[1].toLowerCase());
  ctx.replyWithPhoto(pokemon.sprites.other["official-artwork"].front_default, {
    caption: makeCaption(pokemon),
  });
};
