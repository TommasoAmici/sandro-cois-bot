import { expect, test } from "bun:test";
import { generateStickerSetName } from "../stickerify";

test("generateStickerSetName", () => {
  expect(generateStickerSetName(123, "user", "botNameBot")).toBe(
    "user_123_by_botNameBot",
  );
  expect(generateStickerSetName(-123, "user", "botNameBot")).toBe(
    "user_n123_by_botNameBot",
  );
});
