/**
 * In theory SQLite FTS5 supports symbols in its query syntax, but
 * in practice it doesn't seem to work. So we need to clean the
 * string before passing it to the query.
 *
 * An FTS5 bareword is a string of one or more consecutive characters that are all either:
 * - Non-ASCII range characters (i.e. unicode codepoints greater than 127), or
 * - One of the 52 upper and lower case ASCII characters, or
 * - One of the 10 decimal digit ASCII characters, or
 * - The underscore character (unicode codepoint 96).
 * - The substitute character (unicode codepoint 26).
 * @see https://www.sqlite.org/fts5.html#fts5_strings
 */
export function cleanStringForFTS5Match(str: string) {
  return str.replaceAll(/[!@#?,\$\.'"\\\|\[\]\(\)\{\}\+\-><]/gi, "");
}
