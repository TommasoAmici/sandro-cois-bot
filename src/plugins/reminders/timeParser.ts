import * as chrono from "chrono-node";

const italianCustom = chrono.casual.clone();

italianCustom.parsers.push({
  pattern: () =>
    /\b(tra|fra)\s+(\d+)\s+(minut[oi]|or[ae]|giorn[oi]|settiman[ae]|mes[ei])\b/i,
  extract: (context, match) => {
    const num = Number.parseInt(match[2]);
    const unit = match[3].toLowerCase();

    const now = context.refDate || new Date();
    const result = context.createParsingResult(match.index ?? 0, match[0]);

    const targetDate = new Date(now);

    if (unit.startsWith("minut")) {
      targetDate.setMinutes(targetDate.getMinutes() + num);
    } else if (unit.startsWith("or")) {
      targetDate.setHours(targetDate.getHours() + num);
    } else if (unit.startsWith("giorn")) {
      targetDate.setDate(targetDate.getDate() + num);
    } else if (unit.startsWith("settiman")) {
      targetDate.setDate(targetDate.getDate() + num * 7);
    } else if (unit.startsWith("mes")) {
      targetDate.setMonth(targetDate.getMonth() + num);
    }

    result.start.assign("year", targetDate.getFullYear());
    result.start.assign("month", targetDate.getMonth() + 1);
    result.start.assign("day", targetDate.getDate());
    result.start.assign("hour", targetDate.getHours());
    result.start.assign("minute", targetDate.getMinutes());

    return result;
  },
});

italianCustom.parsers.push({
  pattern: () => /\b(domani|dopodomani|stasera|stanotte|stamattina)\b/i,
  extract: (context, match) => {
    const word = match[0].toLowerCase();
    const now = context.refDate || new Date();
    const result = context.createParsingResult(match.index ?? 0, match[0]);

    const targetDate = new Date(now);

    switch (word) {
      case "domani":
        targetDate.setDate(targetDate.getDate() + 1);
        targetDate.setHours(9, 0, 0, 0);
        break;
      case "dopodomani":
        targetDate.setDate(targetDate.getDate() + 2);
        targetDate.setHours(9, 0, 0, 0);
        break;
      case "stasera":
        targetDate.setHours(20, 0, 0, 0);
        break;
      case "stanotte":
        targetDate.setHours(23, 0, 0, 0);
        break;
      case "stamattina":
        targetDate.setHours(8, 0, 0, 0);
        break;
    }

    result.start.assign("year", targetDate.getFullYear());
    result.start.assign("month", targetDate.getMonth() + 1);
    result.start.assign("day", targetDate.getDate());
    result.start.assign("hour", targetDate.getHours());
    result.start.assign("minute", targetDate.getMinutes());

    return result;
  },
});

italianCustom.parsers.push({
  pattern: () =>
    /\b(luned[iì]|marted[iì]|mercoled[iì]|gioved[iì]|venerd[iì]|sabato|domenica)(?:\s+(prossim[oa]))?\b/i,
  extract: (context, match) => {
    const dayName = match[1].toLowerCase();
    const isNext = !!match[2];
    const now = context.refDate || new Date();
    const result = context.createParsingResult(match.index ?? 0, match[0]);

    const italianDays: { [key: string]: number } = {
      domenica: 0,
      lunedi: 1,
      lunedì: 1,
      martedi: 2,
      martedì: 2,
      mercoledi: 3,
      mercoledì: 3,
      giovedi: 4,
      giovedì: 4,
      venerdi: 5,
      venerdì: 5,
      sabato: 6,
    };

    const targetDay = italianDays[dayName];
    if (targetDay === undefined) return null;

    const targetDate = new Date(now);
    const currentDay = targetDate.getDay();
    let daysToAdd = (targetDay - currentDay + 7) % 7;

    if (daysToAdd === 0) {
      daysToAdd = isNext ? 7 : 0;
    } else if (isNext) {
      daysToAdd += 7;
    }

    targetDate.setDate(targetDate.getDate() + daysToAdd);
    targetDate.setHours(9, 0, 0, 0);

    result.start.assign("year", targetDate.getFullYear());
    result.start.assign("month", targetDate.getMonth() + 1);
    result.start.assign("day", targetDate.getDate());
    result.start.assign("hour", targetDate.getHours());
    result.start.assign("minute", targetDate.getMinutes());

    return result;
  },
});

italianCustom.parsers.push({
  pattern: () =>
    /\b(?:alle?\s+)?(\d{1,2})(?::(\d{2}))?\s*(del mattino|di mattina|del pomeriggio|di pomeriggio|di sera|della sera|di notte|della notte)?\b/i,
  extract: (context, match) => {
    const hour = Number.parseInt(match[1]);
    const minute = match[2] ? Number.parseInt(match[2]) : 0;
    const period = match[3]?.toLowerCase();

    if (hour > 24 || minute > 59) return null;

    const now = context.refDate || new Date();
    const result = context.createParsingResult(match.index ?? 0, match[0]);

    let adjustedHour = hour;

    if (period) {
      if (
        (period.includes("sera") || period.includes("pomeriggio")) &&
        hour < 12
      ) {
        adjustedHour += 12;
      } else if (period.includes("notte") && hour < 6) {
        adjustedHour += 12;
      }
    }

    const targetDate = new Date(now);
    targetDate.setHours(adjustedHour, minute, 0, 0);

    if (targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    result.start.assign("year", targetDate.getFullYear());
    result.start.assign("month", targetDate.getMonth() + 1);
    result.start.assign("day", targetDate.getDate());
    result.start.assign("hour", targetDate.getHours());
    result.start.assign("minute", targetDate.getMinutes());

    return result;
  },
});

export function parseTime(text: string, referenceDate?: Date): Date | null {
  const englishResult = chrono.parseDate(text, referenceDate);
  if (englishResult) {
    return englishResult;
  }

  const italianResult = italianCustom.parseDate(text, referenceDate);
  if (italianResult) {
    return italianResult;
  }

  return null;
}

export function extractTimeFromMessage(
  text: string,
  referenceDate?: Date,
): Date | null {
  const englishParsed = chrono.parse(text, referenceDate);
  if (englishParsed.length > 0 && englishParsed[0].start) {
    return englishParsed[0].start.date();
  }

  const italianParsed = italianCustom.parse(text, referenceDate);
  if (italianParsed.length > 0 && italianParsed[0].start) {
    return italianParsed[0].start.date();
  }

  return null;
}
