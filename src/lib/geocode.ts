declare global {
  // rome-ignore lint/style/noVar: variables in global scope must be declared with `var`
  var lastGeocodeRequest: number;
}
globalThis.lastGeocodeRequest ??= 0;

type GeocodeResponse = {
  place_id: number;
  licence: string;
  powered_by: string;
  osm_type: "relation" | ({} & string);
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: "boundary" | ({} & string);
  type: "administrative" | ({} & string);
  importance: number;
};

const ONE_SECOND = 1000;

/**
 * Geocode a query using the Maps.co API
 */
export async function geocode(query: string) {
  // Rate limit to respect the API limits
  if (Date.now() - globalThis.lastGeocodeRequest < ONE_SECOND) {
    await Bun.sleep(ONE_SECOND);
  }
  globalThis.lastGeocodeRequest = Date.now();

  const url = new URL("https://geocode.maps.co/search");
  url.searchParams.append("q", query);
  const res = await fetch(url);
  return res.json<GeocodeResponse[]>();
}
