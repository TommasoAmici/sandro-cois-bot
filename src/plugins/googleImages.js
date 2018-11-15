import unirest from "unirest";
import { randomChoice } from "./utils";

//TODO return Promise from GET

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

  // make get request to
  // `${baseApi}?q=${query}&cx=${googleCseToken}&key=${googleApiToken}&searchType=image`
  // return Promise or async/await and return URL
};
