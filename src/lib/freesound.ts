// freesound.org

import { randomChoice } from "@/plugins/utils/random";

// https://freesound.org/docs/api/
type SearchResponse = {
  results: {
    id: number;
  }[];
};

type SoundResponse = {
  id: number;
  name: string;
  description: string;
  previews: {
    "preview-hq-mp3": string;
  };
};

export class Freesound {
  #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  get(path: string, query?: Record<string, string>) {
    const url = new URL(`https://freesound.org/apiv2${path}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        url.searchParams.set(k, v);
      }
    }
    return fetch(url, {
      headers: {
        Authorization: `Token ${this.#token}`,
      },
    });
  }

  async getSound(id: number) {
    try {
      const res = await this.get(`/sounds/${id}`);
      const data = await res.json();
      return data as SoundResponse;
    } catch {
      return undefined;
    }
  }

  async search(query: string) {
    try {
      const res = await this.get("/search/text/", { query });
      const data = (await res.json()) as SearchResponse;
      if (data.results.length === 0) {
        return undefined;
      }
      const result = randomChoice(data.results);
      return this.getSound(result.id);
    } catch {
      return undefined;
    }
  }
}
