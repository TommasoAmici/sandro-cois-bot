const Pokedex = require("pokedex");
import { toTitleCase } from "@/utils";
import type { Context, HearsContext } from "grammy";

const pokedex = new Pokedex();

type Pokemon = {
  id: string;
  species_id: string;
  height: string;
  weight: string;
  base_experience: string;
  order: string;
  is_default: string;
  name: string;
  sprites: {
    normal: string;
    animated: string;
  };
};

const makeCaption = (pokemon: Pokemon): string =>
  `#${pokemon.id} ${toTitleCase(pokemon.name)}\nHeight: ${
    Number.parseInt(pokemon.height) / 10
  } m\nWeight: ${Number.parseInt(pokemon.weight) / 10} kg`;

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
