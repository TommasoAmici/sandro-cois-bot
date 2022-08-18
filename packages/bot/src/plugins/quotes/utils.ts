export interface IQuote {
  id: string;
  body: string;
  author?: string;
  date?: string;
}

export const formatQuote = (quote: IQuote) => {
  let body = quote.body;
  if (quote.author) {
    body += `\n- ${quote.author}`;
  }
  if (quote.date) {
    body += ` - ${quote.date}`;
  }
  return body;
};
