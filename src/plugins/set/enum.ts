export const TEXT = 1 as const;
type Text = typeof TEXT;
export const PHOTO = 2 as const;
type Photo = typeof PHOTO;
export const GIF = 3 as const;
type Gif = typeof GIF;
export const STICKER = 4 as const;
type Sticker = typeof STICKER;
export const AUDIO = 5 as const;
type Audio = typeof AUDIO;
export type SetType = Text | Photo | Gif | Sticker | Audio;

export const setTypes = {
  text: TEXT,
  photos: PHOTO,
  gifs: GIF,
  stickers: STICKER,
  audio: AUDIO,
};

export const mediaTypes = {
  text: {
    type: TEXT,
    ext: "txt" as const,
    label: "text" as const,
  },
  photos: {
    type: PHOTO,
    ext: "png" as const,
    label: "photo" as const,
  },
  gifs: {
    type: GIF,
    ext: "gif" as const,
    label: "gif" as const,
  },
  audio: {
    type: AUDIO,
    ext: "mp3" as const,
    label: "audio" as const,
  },
  stickers: {
    type: STICKER,
    ext: "stk" as const,
    label: "sticker" as const,
  },
};

export type MediaType = (typeof mediaTypes)[keyof typeof mediaTypes];
