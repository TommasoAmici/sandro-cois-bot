// Vendored and adapted from https://github.com/vitalets/google-translate-api

export interface RawResponse {
  sentences: (Sentence | SrcTranslit)[];
  src: string;
  confidence: number;
  ld_result: {
    srclangs: string[];
    srclangs_confidences: number[];
    extended_srclangs: string[];
  };
}

export interface Sentence {
  trans: string;
  orig: string;
}

export interface SrcTranslit {
  src_translit: string;
}

export async function translate(
  query: string,
  options?: { from?: string; to?: string },
) {
  const url = new URL("https://translate.google.com/translate_a/single");
  url.searchParams.append("client", "at");
  url.searchParams.append("dt", "t"); // return sentences
  url.searchParams.append("dt", "rm"); // add translit to sentences
  url.searchParams.append("dj", "1"); // result as pretty json instead of deep nested arrays
  const body = new URLSearchParams({
    sl: options?.from ?? "auto",
    tl: options?.to ?? "en",
    q: query,
  }).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
  });
  const data = await res.json<RawResponse>();
  return data.sentences
    .filter((s): s is Sentence => "trans" in s)
    .map((s) => s.trans)
    .join("");
}
