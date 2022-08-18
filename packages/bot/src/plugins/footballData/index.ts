import { Composer } from "grammy";
import competitions from "./competitions";
import matches from "./matches";
import standings from "./standings";

export const footballData = new Composer();
footballData.hears(/^[/!](campionati|tornei|competitions)$/i, competitions);
footballData.hears(/^[/!]ieri ?([a-zA-Z]+)?$/i, matches(-1));
footballData.hears(/^[/!]oggi ?([a-zA-Z]+)?$/i, matches(0));
footballData.hears(/^[/!]domani ?([a-zA-Z]+)?$/i, matches(1));
footballData.hears(/^[/!]ieri_arbitri ?([a-zA-Z])?$/i, matches(-1, true));
footballData.hears(/^[/!]oggi_arbitri ?([a-zA-Z])?$/i, matches(0, true));
footballData.hears(/^[/!]domani_arbitri ?([a-zA-Z])?$/i, matches(1, true));
footballData.hears(/^[/!]classifica ?(\w+)?$/i, standings);
