const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
import { Context, HearsContext } from "grammy";
import cfg from "../config";

const geocodingClient = mbxGeocoding({ accessToken: cfg.mapboxToken });

const makeMapboxScreenshot = (coord: number[]): string =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${coord[0]},${coord[1]},10,0.00,0.00/1000x600@2x?access_token=${cfg.mapboxToken}`;

export const location = async (ctx: HearsContext<Context>): Promise<void> => {
  const query = ctx.match[1];
  geocodingClient
    .forwardGeocode({ query: query, limit: 1 })
    .send()
    .then(async (response: unknown) => {
      if (
        typeof response !== "object" ||
        response === null ||
        !("body" in response) ||
        typeof response.body !== "object" ||
        response.body === null ||
        !("features" in response.body) ||
        !Array.isArray(response.body.features)
      ) {
        return;
      }
      if (response.body.features[0] !== undefined) {
        const coord = response.body.features[0].center;
        await ctx.replyWithPhoto(makeMapboxScreenshot(coord));
        await ctx.replyWithLocation(coord[1], coord[0]);
      }
    });
};
