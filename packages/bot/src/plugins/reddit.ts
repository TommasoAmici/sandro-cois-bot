import axios from "axios";
import * as TelegramBot from "node-telegram-bot-api";
import utils from "./utils";

interface IRedditPost {
  kind: "t3" | string;
  data: {
    approved_at_utc: null | string;
    subreddit: string;
    selftext: string;
    user_reports: any[];
    saved: boolean;
    mod_reason_title: null | string;
    gilded: number;
    clicked: boolean;
    title: string;
    link_flair_richtext: any[];
    subreddit_name_prefixed: `r/${string}`;
    hidden: boolean;
    pwls: number;
    link_flair_css_class: null | unknown;
    downs: number;
    top_awarded_type: null | unknown;
    hide_score: boolean;
    name: string;
    quarantine: boolean;
    link_flair_text_color: "dark" | string;
    upvote_ratio: number;
    author_flair_background_color: "transparent" | string;
    subreddit_type: "public" | string;
    ups: number;
    total_awards_received: number;
    media_embed: unknown;
    media_metadata: {
      [id: string]: {
        status: "valid" | string;
        e: "Image" | string;
        m: "image/png" | string;
        p: {
          y: number;
          x: number;
          u: string;
        }[];
        s: {
          y: number;
          x: number;
          u: string;
        };
        id: string;
      };
    };
    author_flair_template_id: string;
    is_original_content: boolean;
    author_fullname: string;
    secure_media: null | unknown;
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    category: null | unknown;
    secure_media_embed: unknown;
    link_flair_text: null | unknown;
    can_mod_post: boolean;
    score: number;
    approved_by: null | unknown;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    thumbnail: string;
    edited: boolean;
    author_flair_css_class: null | unknown;
    author_flair_richtext: [
      {
        a: string;
        e: string;
        u: string;
      }
    ];
    gildings: unknown;
    content_categories: null | unknown;
    is_self: boolean;
    mod_note: null | unknown;
    crosspost_parent_list: IRedditPost[];
    created: number;
    link_flair_type: "text" | string;
    wls: number;
    removed_by_category: null | unknown;
    banned_by: null | unknown;
    author_flair_type: "richtext" | string;
    domain: string;
    allow_live_comments: boolean;
    selftext_html: null | unknown;
    likes: null | unknown;
    suggested_sort: null | unknown;
    banned_at_utc: null | unknown;
    url_overridden_by_dest: string;
    view_count: null | unknown;
    archived: false;
    no_follow: boolean;
    is_crosspostable: boolean;
    pinned: boolean;
    over_18: boolean;
    all_awardings: unknown[];
    awarders: unknown[];
    media_only: boolean;
    can_gild: boolean;
    spoiler: boolean;
    locked: boolean;
    author_flair_text: string;
    treatment_tags: unknown[];
    visited: boolean;
    removed_by: null | unknown;
    num_reports: null | unknown;
    distinguished: null | unknown;
    subreddit_id: "t5_2qi58";
    author_is_blocked: boolean;
    mod_reason_by: null | unknown;
    removal_reason: null | unknown;
    link_flair_background_color: string;
    id: string;
    is_robot_indexable: boolean;
    report_reasons: null | unknown;
    author: string;
    discussion_type: null | unknown;
    num_comments: number;
    send_replies: boolean;
    whitelist_status: "all_ads" | string;
    contest_mode: boolean;
    mod_reports: unknown[];
    author_patreon_flair: boolean;
    crosspost_parent: string;
    author_flair_text_color: "dark" | string;
    permalink: string;
    parent_whitelist_status: "all_ads" | string;
    stickied: boolean;
    url: string;
    subreddit_subscribers: number;
    created_utc: number;
    num_crossposts: number;
    media: null | unknown;
    is_video: boolean;
  };
}
interface ISubredditResponse {
  kind: string;
  data: {
    after: string;
    dist: number;
    modhash: string;
    geo_filter: string;
    children: IRedditPost[];
    before: string | null;
  };
}

const permalink = (item): string =>
  `\n\nhttps://old.reddit.com${item.data.permalink}`;

const url = (item): string => `\n\n${item.data.url}`;

const buildMessage = (item): string => {
  const links =
    url(item) === permalink(item)
      ? permalink(item)
      : `${url(item)}${permalink(item)}`;
  const text =
    item.data.selftext === ""
      ? `<b>${item.data.title}</b>`
      : `<b>${item.data.title}</b>\n\n${item.data.selftext}`;
  return `${text}${links}`;
};

export default (bot: TelegramBot) =>
  async (msg: TelegramBot.Message, match: RegExpMatchArray): Promise<void> => {
    const subreddit = match[1].toLowerCase();
    let sortBy: string;
    if (match[2] === undefined) {
      sortBy = "hot";
    } else {
      sortBy = match[2].toLowerCase();
    }

    const baseApi = `https://old.reddit.com/r/${subreddit}/${sortBy}.json`;

    try {
      const response = await axios.get<ISubredditResponse>(baseApi);

      if (!response.data.data) {
        bot.sendMessage(msg.chat.id, "Nothing found.");
      } else {
        const item = utils.randomChoice(
          utils.shuffle(response.data.data.children)
        );
        // find correct api method
        if (
          item.data.domain === "gfycat.com" ||
          item.data.url.includes(".gifv")
        ) {
          bot.sendVideo(
            msg.chat.id,
            item.data.preview.reddit_video_preview.fallback_url
          );
        } else if (item.data.domain === "youtu.be") {
          bot.sendMessage(msg.chat.id, buildMessage(item), {
            parse_mode: "HTML",
          });
        } else if (item.data.post_hint === "image") {
          bot.sendPhoto(msg.chat.id, item.data.url);
        }
        // hosted on reddit
        else if (item.data.post_hint === "hosted:video") {
          bot.sendVideo(msg.chat.id, item.data.media.reddit_video.fallback_url);
        }
        // external video hosting
        else if (item.data.post_hint === "rich:video") {
          bot.sendVideo(msg.chat.id, item.data.url);
        }
        // everything else
        else {
          bot.sendMessage(msg.chat.id, buildMessage(item), {
            parse_mode: "HTML",
          });
        }
      }
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        bot.sendMessage(msg.chat.id, error.response.status);
      }
      console.error(error.response);
    }
  };
