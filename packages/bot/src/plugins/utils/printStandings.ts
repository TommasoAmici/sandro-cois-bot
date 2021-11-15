interface Item {
  count: number;
  name: string;
}

export const prettyPrint = (
  items: Item[],
  header = `STATS DELL'ERA SANDRO COIS`
): string => {
  let message = `${header}\n\n`;
  for (let i in items) {
    let emojiMedal = "";
    if (i === "0") {
      emojiMedal = "🥇";
    }
    if (i === "1") {
      emojiMedal = "🥈";
    }
    if (i === "2") {
      emojiMedal = "🥉";
    }
    message += `${emojiMedal} ${items[i].name} - ${items[i].count}\n`;
  }
  return message;
};
