import unirest from "unirest";
import { randomChoice } from "./utils";

// from https://console.developers.google.com/apis/credentials
const googleApiToken = "";
// from https://cse.google.com/
const googleCseToken = "";
const baseApi = "https://www.googleapis.com/customsearch/v1";

// Matches "!i [whatever]"
export default (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const resp = match[1]; // the captured "whatever"

  const query = encodeURIComponent(resp);

  unirest
    .get(
      `${baseApi}?q=${query}&cx=${googleCseToken}&key=${googleApiToken}&searchType=image`
    )
    .end(function(result) {
      // search returns 10 results, get one at random
      return randomChoice(result.body.items).link;
    });
};
