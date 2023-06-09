import { describe, expect, test } from "bun:test";
import { cleanKey, cleanMerda, recursivelyRemoveMerda } from "../amoreMerda";

describe("recursivelyRemoveMerda", () => {
  test("base case", () => {
    expect(recursivelyRemoveMerda("roma merda")).toBe("roma  merda");
  });
  test("removes one time", () => {
    expect(recursivelyRemoveMerda("romammerda")).toBe("roma merda");
  });
  test("removes five times", () => {
    expect(recursivelyRemoveMerda("romammmmmmerda")).toBe("roma merda");
  });
});

describe("cleanKey", () => {
  test("removes user tags", () => {
    expect(cleanKey("@jianlucah pagliuca")).toBe("jianlucah pagliuca");
  });
  test("removes spaces", () => {
    expect(cleanKey("  @jianlucah pagliuca ")).toBe("jianlucah pagliuca");
  });
  test("returns lowercase", () => {
    expect(cleanKey("  @JIanlucah pagliuCA ")).toBe("jianlucah pagliuca");
  });
});

describe("cleanMerda", () => {
  test("base case", () => {
    expect(cleanMerda("roma merda")).toBe("roma");
  });
  test("removes one time", () => {
    expect(cleanMerda("romammèrda")).toBe("roma");
  });
  test("removes one time", () => {
    expect(cleanMerda("romammerda")).toBe("roma");
  });
  test("removes five times", () => {
    expect(cleanMerda("romammmmmmerda")).toBe("roma");
  });
});
