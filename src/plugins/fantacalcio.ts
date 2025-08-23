import type { Context, HearsContext } from "grammy";
import * as cheerio from "cheerio";
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";

interface PlayerData {
  team: string;
  player_name: string;
  player_id: string;
}

interface FantacalcioStats {
  name: string;
  team: string;
  role: string;
  matches: number;
  goals: number;
  assists: number;
  avgVoto: number;
  avgFantavoto: number;
  quotation: number;
}

const loadPlayerData = (): Map<string, PlayerData> => {
  const csvPath = path.join(process.cwd(), "data", "fantacalcio-players.csv");
  const playerMap = new Map<string, PlayerData>();

  try {
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const records: PlayerData[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    for (const record of records) {
      const normalizedName = record.player_name.toLowerCase().trim();
      playerMap.set(normalizedName, record);
    }
  } catch (error) {
    console.error("Error loading player data:", error);
  }

  return playerMap;
};

const parseFantacalcioPage = (html: string): FantacalcioStats | null => {
  try {
    const $ = cheerio.load(html);

    // Extract player name from title or h1
    const name =
      $("h1").first().text().trim() || $("title").text().split("-")[0].trim();

    // Extract team
    const team =
      $(".player-team").text().trim() ||
      $('[class*="team"]').first().text().trim() ||
      "";

    // Extract role
    const role =
      $(".player-role").text().trim() ||
      $('[class*="role"]').first().text().trim() ||
      "";

    // Try to find stats in various possible structures
    let matches = 0,
      goals = 0,
      assists = 0,
      avgVoto = 0,
      avgFantavoto = 0,
      quotation = 0;

    // Look for stats in table format
    $("table tr").each((_, row) => {
      const label = $(row).find("td").first().text().toLowerCase();
      const value = $(row).find("td").last().text();

      if (label.includes("presenze") || label.includes("partite")) {
        matches = Number.parseInt(value) || 0;
      } else if (label.includes("gol") || label.includes("goal")) {
        goals = Number.parseInt(value) || 0;
      } else if (label.includes("assist")) {
        assists = Number.parseInt(value) || 0;
      } else if (label.includes("media voto") || label.includes("mv")) {
        avgVoto = Number.parseFloat(value.replace(",", ".")) || 0;
      } else if (label.includes("media fantavoto") || label.includes("fm")) {
        avgFantavoto = Number.parseFloat(value.replace(",", ".")) || 0;
      } else if (label.includes("quotazione")) {
        quotation = Number.parseInt(value) || 0;
      }
    });

    // Alternative: Look for stats in div/span structures
    $('[class*="stat"]').each((_, elem) => {
      const text = $(elem).text().toLowerCase();
      const valueMatch = text.match(/(\d+(?:[.,]\d+)?)/);
      if (valueMatch) {
        const value = valueMatch[1].replace(",", ".");
        if (text.includes("presenze") || text.includes("partite")) {
          matches = Number.parseInt(value) || matches;
        } else if (text.includes("gol") || text.includes("goal")) {
          goals = Number.parseInt(value) || goals;
        } else if (text.includes("assist")) {
          assists = Number.parseInt(value) || assists;
        } else if (text.includes("media voto") || text.includes("mv")) {
          avgVoto = Number.parseFloat(value) || avgVoto;
        } else if (text.includes("media fantavoto") || text.includes("fm")) {
          avgFantavoto = Number.parseFloat(value) || avgFantavoto;
        } else if (text.includes("quotazione")) {
          quotation = Number.parseInt(value) || quotation;
        }
      }
    });

    return {
      name,
      team,
      role,
      matches,
      goals,
      assists,
      avgVoto,
      avgFantavoto,
      quotation,
    };
  } catch (error) {
    console.error("Error parsing fantacalcio page:", error);
    return null;
  }
};

export const fantacalcio = async (ctx: HearsContext<Context>) => {
  const playerName = ctx.match[1]?.toLowerCase().trim();

  if (!playerName) {
    await ctx.reply(
      "Specifica il nome del giocatore. Esempio: /fantacalcio lukaku",
    );
    return;
  }

  const playerData = loadPlayerData();
  const player = playerData.get(playerName);

  if (!player) {
    await ctx.reply(
      `Giocatore "${playerName}" non trovato nel database. Assicurati di scrivere il nome correttamente.`,
    );
    return;
  }

  const url = `https://www.fantacalcio.it/serie-a/squadre/${player.team.toLowerCase()}/${player.player_name.toLowerCase().replace(/\s+/g, "-")}/${player.player_id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      await ctx.reply(`Errore nel recuperare i dati per ${player.player_name}`);
      return;
    }

    const html = await response.text();
    const stats = parseFantacalcioPage(html);

    if (!stats) {
      await ctx.reply(
        `Non sono riuscito a estrarre le statistiche per ${player.player_name}`,
      );
      return;
    }

    const message = `📊 *${stats.name}* (${stats.team})
${stats.role ? `Ruolo: ${stats.role}` : ""}

⚽ Statistiche Stagione:
• Presenze: ${stats.matches}
• Gol: ${stats.goals}
• Assist: ${stats.assists}
• Media Voto: ${stats.avgVoto.toFixed(2)}
• Media Fantavoto: ${stats.avgFantavoto.toFixed(2)}
${stats.quotation > 0 ? `• Quotazione: ${stats.quotation}` : ""}

🔗 [Vedi su Fantacalcio.it](${url})`;

    await ctx.reply(message, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error("Error fetching fantacalcio data:", error);
    await ctx.reply("Si è verificato un errore nel recuperare i dati.");
  }
};

