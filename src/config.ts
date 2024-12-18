export default {
  telegramToken: process.env.TELEGRAM_TOKEN,
  freesoundToken: process.env.FREESOUND_TOKEN ?? "",
  openWeatherToken: process.env.OPENWEATHER_TOKEN,
  giphyToken: process.env.GIPHY_TOKEN,
  mapboxToken: process.env.MAPBOX_TOKEN,
  footballDataToken: process.env.FOOTBALLDATA_TOKEN,
  alphaVantageToken: process.env.ALPHA_VANTAGE_TOKEN,
  httpSegmentation: {
    url: process.env.HTTP_SEGMENTATION_URL,
    auth: `Basic ${process.env.HTTP_SEGMENTATION_AUTH}`,
  },
};
