import { describe, expect, test } from "vitest";
import { cleanKey, cleanMerda, recursivelyRemoveMerda } from "../amoreMerda";

describe("recursivelyRemoveMerda", () => {
  test.concurrent("base case", () => {
    expect(recursivelyRemoveMerda("roma merda")).toBe("roma  merda");
  });
  test.concurrent("removes one time", () => {
    expect(recursivelyRemoveMerda("romammerda")).toBe("roma merda");
  });
  test.concurrent("removes five times", () => {
    expect(recursivelyRemoveMerda("romammmmmmerda")).toBe("roma merda");
  });
});

describe("cleanKey", () => {
  test.concurrent("removes user tags", () => {
    expect(cleanKey("@jianlucah pagliuca")).toBe("jianlucah pagliuca");
  });
  test.concurrent("removes spaces", () => {
    expect(cleanKey("  @jianlucah pagliuca ")).toBe("jianlucah pagliuca");
  });
  test.concurrent("returns lowercase", () => {
    expect(cleanKey("  @JIanlucah pagliuCA ")).toBe("jianlucah pagliuca");
  });
});

describe("cleanMerda", () => {
  test.concurrent("base case", () => {
    expect(cleanMerda("roma merda")).toBe("roma");
  });
  test.concurrent("removes one time", () => {
    expect(cleanMerda("romammèrda")).toBe("roma");
  });
  test.concurrent("removes one time", () => {
    expect(cleanMerda("romammerda")).toBe("roma");
  });
  test.concurrent("removes five times", () => {
    expect(cleanMerda("romammmmmmerda")).toBe("roma");
  });
});
