const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
import cfg from "../config";

const geocodingClient = mbxGeocoding({ accessToken: cfg.mapboxToken });

const makeMapboxScreenshot = coord =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${coord[0]},${
    coord[1]
  },10,0.00,0.00/1000x600@2x?access_token=${cfg.mapboxToken}`;

export default bot => (msg, match) => {
  const query = match[1];

  geocodingClient
    .forwardGeocode({ query: query, limit: 1 })
    .send()
    .then(response => {
      const coord = response.body.features[0].center;
      bot.sendPhoto(msg.chat.id, makeMapboxScreenshot(coord));
      bot.sendLocation(msg.chat.id, coord[1], coord[0]);
    });
};
