const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
import type { Context, HearsContext } from "grammy";
import cfg from "../config";

const geocodingClient = mbxGeocoding({ accessToken: cfg.mapboxToken });

const makeMapboxScreenshot = (coord: number[]): string =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${coord[0]},${coord[1]},10,0.00,0.00/1000x600@2x?access_token=${cfg.mapboxToken}`;

export const location = (ctx: HearsContext<Context>): void => {
  const query = ctx.match[1];

  geocodingClient
    .forwardGeocode({ query, limit: 1 })
    .send()
    .then(response => {
      if (response.body.features[0] !== undefined) {
        const coord = response.body.features[0].center;
        ctx.replyWithPhoto(makeMapboxScreenshot(coord));
        ctx.replyWithLocation(coord[1], coord[0]);
      }
    });
};
