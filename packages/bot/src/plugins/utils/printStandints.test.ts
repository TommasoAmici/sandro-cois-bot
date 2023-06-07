import { expect, test } from "bun:test";
import { prettyPrintStanding } from "./printStandings";

test("printStandings", () => {
  const expected = "🥇 test - 5\n🥈 test - 4\n🥉 test - 3\ntest - 2\n";
  expect(
    prettyPrintStanding([
      { text: "test", count: 5 },
      { text: "test", count: 4 },
      { text: "test", count: 3 },
      { text: "test", count: 2 },
    ]),
  ).toBe(expected);
});
