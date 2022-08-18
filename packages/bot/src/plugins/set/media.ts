export type Media = {
  type: string;
  ext: string;
};

export const media: {
  stickers: Media;
  gifs: Media;
  photos: Media;
  text: Media;
} = {
  stickers: { type: "stickers", ext: "stk" },
  gifs: { type: "gifs", ext: "gif" },
  photos: { type: "photos", ext: "png" },
  text: { type: "text", ext: "txt" },
};
