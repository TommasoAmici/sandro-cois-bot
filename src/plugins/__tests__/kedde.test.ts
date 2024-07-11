import { expect, it } from "bun:test";
import { convert } from "../kedde";

it.each([
  ["stadium", "sdediem"],
  ["togliete", "degliede"],
  ["soqquadro", "segguedre"],
  ["ovviamente", "evviemende"],
])("converts text", (value, expected) => {
  expect(convert(value)).toBe(expected);
});
