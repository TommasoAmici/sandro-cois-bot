import { geocode } from "@/lib/geocode";
import type { Context, HearsContext } from "grammy";
import cfg from "../config";

const makeMapboxScreenshot = (lat: number, lon: number): string =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${lon},${lat},10,0.00,0.00/1000x600@2x?access_token=${cfg.mapboxToken}`;

export async function location(ctx: HearsContext<Context>) {
  const query = ctx.match[1];
  const data = await geocode(query);
  if (data.length > 0) {
    const lat = Number.parseFloat(data[0].lat);
    const lon = Number.parseFloat(data[0].lon);
    await ctx.replyWithLocation(lat, lon);
    if (cfg.mapboxToken) {
      await ctx.replyWithPhoto(makeMapboxScreenshot(lat, lon));
    }
  } else {
    await ctx.reply("No results found");
  }
}
