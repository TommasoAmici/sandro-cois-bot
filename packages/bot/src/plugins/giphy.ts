import { Context, HearsContext } from "grammy";
import { request } from "undici";
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

export const getGif = async (
  query: string,
): Promise<IGiphyResponse | undefined> => {
  if (!cfg.giphyToken) {
    console.error("No giphy token found.");
    return undefined;
  }
  const baseApi = "https://api.giphy.com/v1/gifs/search";

  const params = new URLSearchParams({
    q: query,
    limit: "20",
    api_key: cfg.giphyToken,
    rating: "R",
    lang: "it",
  });
  const res = await request(`${baseApi}?${params.toString()}`);
  return res.body.json();
};

export const sendGif = async (
  ctx: HearsContext<Context>,
  response: IGiphyResponse | undefined,
) => {
  if (!response?.data || response.data.length === 0) {
    await ctx.reply("No gif found.");
  } else {
    const item = randomChoice(response.data);
    const url = item.images.original.mp4 ?? item.images.original.url;
    if (!url) {
      await ctx.reply("No gif found.");
    } else {
      await ctx.replyWithVideo(url);
    }
  }
};

export const giphy = async (ctx: HearsContext<Context>): Promise<void> => {
  const query = ctx.match[1];
  try {
    const response = await getGif(query);
    await sendGif(ctx, response);
  } catch (error) {
    ctx.reply("Error :(");
    console.error(error);
  }
};
