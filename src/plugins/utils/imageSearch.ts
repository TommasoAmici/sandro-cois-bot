const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// DuckDuckGo's image endpoint rejects requests that do not look like the
// browser XHR request made by its results page (HTTP 403). Keep these headers
// together so the initial page load and API request stay easy to compare.
const IMAGE_API_HEADERS = {
  "User-Agent": USER_AGENT,
  Accept: "application/json, text/javascript, */*; q=0.01",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://duckduckgo.com/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "X-Requested-With": "XMLHttpRequest",
};

const VQD_PATTERNS = [
  /vqd=(\d+-\d+)/,
  /"vqd":"(\d+-\d+)"/,
  /'vqd':'(\d+-\d+)'/,
];

interface DuckDuckGoImageResult {
  image: string;
  title: string;
  url: string;
}

interface DuckDuckGoImageResponse {
  results?: DuckDuckGoImageResult[];
}

export interface ImageSearchResult {
  url: string;
}

const extractVqd = (html: string): string | undefined => {
  for (const pattern of VQD_PATTERNS) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
};

export const searchImages = async (
  query: string,
): Promise<ImageSearchResult[]> => {
  const searchPageUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  const searchPageResponse = await fetch(searchPageUrl, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!searchPageResponse.ok) {
    throw new Error(
      `Image search page request failed with status ${searchPageResponse.status}`,
    );
  }

  const html = await searchPageResponse.text();
  const vqd = extractVqd(html);
  if (!vqd) {
    throw new Error("Could not initialize image search");
  }

  const apiUrl = new URL("https://duckduckgo.com/i.js");
  apiUrl.searchParams.set("l", "us-en");
  apiUrl.searchParams.set("o", "json");
  apiUrl.searchParams.set("q", query);
  apiUrl.searchParams.set("vqd", vqd);
  apiUrl.searchParams.set("f", ",,,,,");
  apiUrl.searchParams.set("p", "1");

  const apiResponse = await fetch(apiUrl, {
    headers: IMAGE_API_HEADERS,
  });

  if (!apiResponse.ok) {
    throw new Error(
      `Image search API request failed with status ${apiResponse.status}`,
    );
  }

  const data = (await apiResponse.json()) as DuckDuckGoImageResponse;
  return (data.results ?? [])
    .map((result) => ({ url: result.image }))
    .filter((result) => result.url.length > 0);
};
