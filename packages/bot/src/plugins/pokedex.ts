const Pokedex = require("pokedex");
import { Context, HearsContext } from "grammy";
import { toTitleCase } from "./utils";

const pokedex = new Pokedex();

const makeCaption = (pokemon: any): string =>
  `#${pokemon.id} ${toTitleCase(pokemon.name)}\nHeight: ${
    pokemon.height / 10
  } m\nWeight: ${pokemon.weight / 10} kg`;

export const pokedexByName = async (ctx: HearsContext<Context>) => {
  const pokemon = pokedex.pokemon(ctx.match[1].toLowerCase());
  await ctx.replyWithVideo(pokemon.sprites.animated, {
    caption: makeCaption(pokemon),
  });
};

export const pokedexByID = async (ctx: HearsContext<Context>) => {
  const pokemon = pokedex.pokemon(+ctx.match[1]);
  await ctx.replyWithVideo(pokemon.sprites.animated, {
    caption: makeCaption(pokemon),
  });
};
