const TEXT = 1 as const;
type Text = typeof TEXT;
const PHOTO = 2 as const;
type Photo = typeof PHOTO;
const GIF = 3 as const;
type Gif = typeof GIF;
const STICKER = 4 as const;
type Sticker = typeof STICKER;
export type SetType = Text | Photo | Gif | Sticker;

export const setTypes = {
  text: TEXT,
  photos: PHOTO,
  gifs: GIF,
  stickers: STICKER,
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
  stickers: {
    type: STICKER,
    ext: "stk" as const,
    label: "sticker" as const,
  },
};

export type MediaType = (typeof mediaTypes)[keyof typeof mediaTypes];
