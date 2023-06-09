export function prettyPrintStanding(items: { text: string; count: number }[]) {
  let message = "";
  for (const [index, item] of items.entries()) {
    let emojiMedal = "";
    switch (index) {
      case 0:
        emojiMedal = "🥇 ";
        break;
      case 1:
        emojiMedal = "🥈 ";
        break;
      case 2:
        emojiMedal = "🥉 ";
        break;
      default:
        break;
    }
    message += `${emojiMedal}${item.text} - ${item.count}\n`;
  }

  return message;
}
