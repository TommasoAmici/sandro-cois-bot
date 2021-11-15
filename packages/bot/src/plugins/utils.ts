import axios, { AxiosResponse } from "axios";
import * as TelegramBot from "node-telegram-bot-api";
import cfg from "../config";
import { randomChoice } from "./utils/random";

const toTitleCase = (str: string): string =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

interface IGiphyImage {
  height?: string;
  width?: string;
  size?: string;
  url?: string;
  mp4_size?: string;
  mp4?: string;
  webp_size?: string;
  webp?: string;
  frames?: string;
  hash?: string;
}

interface IGiphyItem {
  type: "gif" | string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: "g" | string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: {
    original: IGiphyImage;
    downsized: IGiphyImage;
    downsized_large: IGiphyImage;
    downsized_medium: IGiphyImage;
    downsized_small: IGiphyImage;
    downsized_still: IGiphyImage;
    fixed_height: IGiphyImage;
    fixed_height_downsampled: IGiphyImage;
    fixed_height_small: IGiphyImage;
    fixed_height_small_still: IGiphyImage;
    fixed_height_still: IGiphyImage;
    fixed_width: IGiphyImage;
    fixed_width_downsampled: IGiphyImage;
    fixed_width_small: IGiphyImage;
    fixed_width_small_still: IGiphyImage;
    fixed_width_still: IGiphyImage;
    looping: IGiphyImage;
    original_still: IGiphyImage;
    original_mp4: IGiphyImage;
    preview: IGiphyImage;
    preview_gif: IGiphyImage;
    preview_webp: IGiphyImage;
    "480w_still": IGiphyImage;
  };
  user: {
    avatar_url: string;
    banner_image: string;
    banner_url: string;
    profile_url: string;
    username: string;
    display_name: string;
    description: string;
    instagram_url: string;
    website_url: string;
    is_verified: boolean;
  };
  analytics_response_payload: string;
  analytics: {
    onload: {
      url: string;
    };
    onclick: {
      url: string;
    };
    onsent: {
      url: string;
    };
  };
}

interface IGiphyResponse {
  data: IGiphyItem[];
}

const getGif = async (query: string) => {
  const baseApi = "https://api.giphy.com/v1/gifs/search";

  const params = {
    q: query,
    limit: 20,
    api_key: cfg.giphyToken,
    rating: "R",
    lang: "it",
  };
  return await axios.get<IGiphyResponse>(baseApi, { params });
};

const sendGif = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  response: AxiosResponse<IGiphyResponse>
): void => {
  if (!response.data.data || response.data.data.length === 0) {
    bot.sendMessage(msg.chat.id, "No gif found.");
  } else {
    const item = randomChoice(response.data.data);
    bot.sendVideo(
      msg.chat.id,
      item.images.original.mp4 || item.images.original.url
    );
  }
};

const paginateMessages = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  longMsg: string
) => {
  const chunks: string[] = [];
  if (longMsg.length > 3000) {
    bot.sendMessage(msg.chat.id, "Dio porco ti ammazzo!");
    return;
  }
  const maxChars = longMsg.length;
  for (let i = 0; i < maxChars; i += 3000) {
    chunks.push(longMsg.substring(i, i + 3000));
  }
  chunks.forEach((chunk) => {
    bot.sendMessage(msg.chat.id, chunk);
  });
};

export default {
  toTitleCase,
  sendGif,
  getGif,
  paginateMessages,
};
