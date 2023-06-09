import { middlewareFactory } from "@/middleware";
import { Composer } from "grammy";
import competitions from "./competitions";
import matches from "./matches";
import standings from "./standings";

export const footballDataComposer = new Composer();

footballDataComposer.hears(
  /^[/!](campionati|tornei|competitions)$/i,
  middlewareFactory(competitions),
);
footballDataComposer.hears(
  /^[/!]ieri ?([a-zA-Z]+)?$/i,
  middlewareFactory(matches(-1)),
);
footballDataComposer.hears(
  /^[/!]oggi ?([a-zA-Z]+)?$/i,
  middlewareFactory(matches(0)),
);
footballDataComposer.hears(
  /^[/!]domani ?([a-zA-Z]+)?$/i,
  middlewareFactory(matches(1)),
);
footballDataComposer.hears(
  /^[/!]ieri_arbitri ?([a-zA-Z])?$/i,
  middlewareFactory(matches(-1, true)),
);
footballDataComposer.hears(
  /^[/!]oggi_arbitri ?([a-zA-Z])?$/i,
  middlewareFactory(matches(0, true)),
);
footballDataComposer.hears(
  /^[/!]domani_arbitri ?([a-zA-Z])?$/i,
  middlewareFactory(matches(1, true)),
);
footballDataComposer.hears(
  /^[/!]classifica ?(\w+)?$/i,
  middlewareFactory(standings),
);
