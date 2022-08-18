import axios from "axios";
import type { Context, HearsContext } from "grammy";
import cfg from "../config";
import { randomChoice } from "./utils/random";

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

export const sendGifFromQuery = async (ctx: Context, query: string) => {
  try {
    const response = await getGif(query);
    if (!response.data.data || response.data.data.length === 0) {
      ctx.reply("No gif found");
    } else {
      const item = randomChoice(response.data.data);
      ctx.replyWithVideo(item.images.original.mp4 ?? item.images.original.url);
    }
  } catch (error) {
    if (error.response && error.response.status >= 400) {
      ctx.reply(error.response.status);
    }
    console.error(error.response);
  }
};

export const giphy = async (ctx: HearsContext<Context>) => {
  let query = ctx.match[1];

  if (query === undefined && ctx.msg.reply_to_message) {
    query = ctx.msg.reply_to_message.text;
  }

  sendGifFromQuery(ctx, query);
};
