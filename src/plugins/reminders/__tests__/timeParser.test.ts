import { describe, it, expect } from "bun:test";
import { parseTime, extractTimeFromMessage } from "../timeParser";

describe("timeParser", () => {
  describe("parseTime", () => {
    const now = new Date("2024-01-15T10:00:00");

    describe("Italian expressions", () => {
      it("should parse 'tra X minuti'", () => {
        const result = parseTime("tra 5 minuti", now);
        expect(result).toBeTruthy();
        expect(result?.getTime()).toBeCloseTo(
          now.getTime() + 5 * 60 * 1000,
          -3,
        );
      });

      it("should parse 'fra X ore'", () => {
        const result = parseTime("fra 2 ore", now);
        expect(result).toBeTruthy();
        expect(result?.getTime()).toBeCloseTo(
          now.getTime() + 2 * 60 * 60 * 1000,
          -3,
        );
      });

      it("should parse 'tra X giorni'", () => {
        const result = parseTime("tra 3 giorni", now);
        expect(result).toBeTruthy();
        const expected = new Date(now);
        expected.setDate(expected.getDate() + 3);
        expect(result?.getDate()).toBe(expected.getDate());
      });

      it("should parse 'domani'", () => {
        const result = parseTime("domani", now);
        expect(result).toBeTruthy();
        const expected = new Date(now);
        expected.setDate(expected.getDate() + 1);
        expected.setHours(9, 0, 0, 0);
        expect(result?.getDate()).toBe(expected.getDate());
        expect(result?.getHours()).toBe(9);
      });

      it("should parse 'dopodomani'", () => {
        const result = parseTime("dopodomani", now);
        expect(result).toBeTruthy();
        const expected = new Date(now);
        expected.setDate(expected.getDate() + 2);
        expect(result?.getDate()).toBe(expected.getDate());
      });

      it("should parse 'stasera'", () => {
        const result = parseTime("stasera", now);
        expect(result).toBeTruthy();
        expect(result?.getHours()).toBe(20);
        expect(result?.getDate()).toBe(now.getDate());
      });

      it("should parse Italian weekdays", () => {
        const mondayNow = new Date("2024-01-15T10:00:00");
        const result = parseTime("lunedì prossimo", mondayNow);
        expect(result).toBeTruthy();
        if (result) {
          expect(result.getDay()).toBe(1);
        }
      });

      it("should parse 'lunedì prossimo'", () => {
        const mondayNow = new Date("2024-01-15T10:00:00");
        const result = parseTime("lunedì prossimo", mondayNow);
        expect(result).toBeTruthy();
        expect(result?.getDay()).toBe(1);
        expect(result?.getDate()).toBe(22);
      });

      it("should parse time with Italian period indicators", () => {
        const result = parseTime("alle 3 del pomeriggio", now);
        expect(result).toBeTruthy();
        expect(result?.getHours()).toBe(15);
      });

      it("should parse 'alle 22:30'", () => {
        const result = parseTime("alle 22:30", now);
        expect(result).toBeTruthy();
        expect(result?.getHours()).toBe(22);
        expect(result?.getMinutes()).toBe(30);
      });
    });

    describe("English expressions", () => {
      it("should parse 'in 5 minutes'", () => {
        const result = parseTime("in 5 minutes", now);
        expect(result).toBeTruthy();
        expect(result?.getTime()).toBeCloseTo(
          now.getTime() + 5 * 60 * 1000,
          -3,
        );
      });

      it("should parse 'tomorrow'", () => {
        const result = parseTime("tomorrow", now);
        expect(result).toBeTruthy();
        const expected = new Date(now);
        expected.setDate(expected.getDate() + 1);
        expect(result?.getDate()).toBe(expected.getDate());
      });

      it("should parse 'next Monday'", () => {
        const result = parseTime("next Monday", now);
        expect(result).toBeTruthy();
        expect(result?.getDay()).toBe(1);
      });

      it("should parse 'at 3pm'", () => {
        const result = parseTime("at 3pm", now);
        expect(result).toBeTruthy();
        expect(result?.getHours()).toBe(15);
      });

      it("should parse '2024-12-25 15:30'", () => {
        const result = parseTime("2024-12-25 15:30", now);
        expect(result).toBeTruthy();
        expect(result?.getFullYear()).toBe(2024);
        expect(result?.getMonth()).toBe(11);
        expect(result?.getDate()).toBe(25);
        expect(result?.getHours()).toBe(15);
        expect(result?.getMinutes()).toBe(30);
      });
    });

    it("should return null for unparseable text", () => {
      const result = parseTime("questo non è un tempo", now);
      expect(result).toBeNull();
    });
  });

  describe("extractTimeFromMessage", () => {
    const now = new Date("2024-01-15T10:00:00");

    it("should extract time from a message with Italian time expression", () => {
      const result = extractTimeFromMessage(
        "Ricordami di chiamare Mario domani alle 15",
        now,
      );
      expect(result).toBeTruthy();
      const expected = new Date(now);
      expected.setDate(expected.getDate() + 1);
      expect(result?.getDate()).toBe(expected.getDate());
    });

    it("should extract time from a message with English time expression", () => {
      const result = extractTimeFromMessage(
        "Meeting scheduled for tomorrow at 3pm",
        now,
      );
      expect(result).toBeTruthy();
      expect(result?.getHours()).toBe(15);
    });

    it("should return null if no time expression is found", () => {
      const result = extractTimeFromMessage(
        "This message has no time information",
        now,
      );
      expect(result).toBeNull();
    });

    it("should extract the first time expression from multiple ones", () => {
      const result = extractTimeFromMessage(
        "Appuntamento domani, poi dopodomani altro meeting",
        now,
      );
      expect(result).toBeTruthy();
      const expected = new Date(now);
      expected.setDate(expected.getDate() + 1);
      expect(result?.getDate()).toBe(expected.getDate());
    });
  });
});
