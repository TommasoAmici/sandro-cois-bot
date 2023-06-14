import { describe, expect, test } from "bun:test";
import { cleanStringForFTS5Match } from "./sqlite";

describe("cleanStringForFTS5Match", () => {
  test("should remove special characters", () => {
    expect(cleanStringForFTS5Match("hello!@#?,$.'\"|[](){}+-><\\ world")).toBe(
      "hello world",
    );
  });
});
