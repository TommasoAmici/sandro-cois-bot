import * as TelegramBot from "node-telegram-bot-api";

const songs = {
  0: `Osteria numero zero
ho visto un prete tutto nero
che con mille contorsioni
suona il piano coi coglioni`,
  "0a": `Osteria numero zero
Ce l'ho lungo come un cero
su facciamo l'orazione
del magnifico uccellone`,
  1: `Osteria numero uno
in convento non c'è nessuno
ma qui ci sono preti e frati
che s'inculano beati`,
  "1a": `Osteria numero uno
in osteria non c'è nessuno
sono tutti contro il muro
per veder chi ce l'ha più duro`,
  "1b": `Osteria numero uno
In cantina non c'è nessuno
c'è soltanto un topolino
che si gratta l'uccellino`,
  "1c": `Osteria numero uno
C'è quel porco di Nettuno
nella destra ha il tridente
e con l'altra fa il fetente`,
  "1d": `Osteria numero uno
Dentro il bar non c'è nessuno
c'è soltanto il cameriere
con le palle nel bicchiere`,
  "1e": `Osteria numero uno
Nel castello non c'è nessuno
ci sta solo la contessa
che lo piglia nella fessa`,
  "1f": `Osteria numero uno
A casa mia nun c'è nessuno
c'è mi nonno in mutandoni
che se gratta li coglioni`,
  "1g": `Osteria numero uno
Nella strada non c'è nessuno
c'è no sbirro nell'alfetta
che se spara na pugnetta.`,
  "1h": `Osteria numero uno
Tu hai un cazzo io ne ho trentuno
trenta fighe in una botta
l'altro cazzo te lo metto in bocca`,
  "1i": `Osteria numero uno
Sull'autostrada non c'è nessuno
c'è soltanto un casellante
che se masturba cor brillante`,
  "1j": `Osteria numero uno
A casa mia non c'è nessuno
c'è mi nonno in mutandine
che se 'n chiappetta le signorine.`,
  2: `Osteria numero due
le mie gambe fra le tue
le tue gambe fra le mie
fanno mille porcherie`,
  3: `Osteria numero tre
la Peppina fa il caffè
fa il caffè una volta al mese
con le pezze del marchese`,
  "3a": `Osteria numero tre
Qui si fan gli onori al re
chi davanti al re s'inchina
poi s'incula la regina`,
  "3b": `Osteria numero tre
La bidella fa il caffè
fa il caffè alla polacca
con i peli della pucchiacca`,
  4: `Osteria numero quattro
la servetta ha rotto il piatto
per non dirlo alla padrona
se lo ficca nella mona`,
  "4a": `Osteria numero quattro
la marchesa aveva un gatto
con la coda del felino
si faceva un ditalino`,
  "4b": `Osteria numero quattro
la marchesa ha rotto il piatto
e per non farlo più vedere
ficca i cocci nel sedere`,
  5: `Osteria numero cinque
c'è chi perde e c'è chi vince
ma chi perde caso strano
se lo trova dentro l'ano`,
  6: `Osteria numero sei
c'è il casino degli ebrei
ma gli ebrei son porcaccioni
ficcan dentro anche i coglioni`,
  "6a": `Osteria numero sei
alle donne ghe piase l'osei
ghe piase l'osei senza le ale
che va su su sino ale pale`,
  7: `Osteria numero sette
il salame si fa a fette
ma alle donne caso strano
il salame piace sano`,
  8: `Osteria numero otto
la marchesa fa il risotto
fa il risotto ben condito
con la sborra del marito`,
  "8a": `Osteria numero otto
cazzo in mano e culo rotto
culo rotto e cazzo in mano
per inculare il Vaticano`,
  9: `Osteria numero nove
i soldati fan le prove
fan le prove contro il muro
per veder chi l'ha più duro`,
  "9a": `Osteria numero nove
la marchesa fa le prove
fa le prove col prosciutto
per vedere se c'entra tutto`,
  10: `Osteria numero dieci
se c'hai fame mangia i ceci
per la fica e per il culo
troverai sempre un padulo`,
  "10a": `Osteria numero dieci
il sacrista fa le veci
fa le veci al cappellano
e lo prende dentro l'ano`,
  20: `Osteria numero venti
se la fica avesse i denti
quanti cazzi all'ospedale
quante fiche in tribunale`,
  "20a": `Osteria numero venti
se la fica avesse i denti
quanti cazzi morsicati
quanti giovani rovinati`,
  30: `Osteria numero trenta
chi dà il culo non si penta
oggigiorno caso strano
va di moda il deretano`,
  80: `Osteria numer'ottanta
la mattina il gallo canta
la mattina sul più bello
s'alza pure il mio uccello`,
  100: `Osteria numero cento
se la fica andasse a vento
quanti cazzi in alto mare
tu vedresti navigare`,
  "100a": `Osteria numero cento
più tu spingi più va dentro
ma se spingi oltremisura
poi ti nasce una creatura`,
  "100b": `Osteria numero cento
il mio cazzo è di cemento
di cemento bene armato
quando è dentro fa il selciato`,
  1000: `Osteria numero mille
il mio cazzo fa scintille
fa scintille rosse e gialle
mi s'illuminan le palle`,
  "1000a": `Osteria numero mille
il mio cazzo fa scintille
fa scintille sulla legna
figuriamoci nella fregna`,
  "1000b": `Osteria numero mille
il mio cazzo fa scintille
fa scintille nella notte
per veder le donne biotte`,
  piave: `Osteria del fiume Piave
A noi l’austriaci non ce piace
Perché sai a Caporetto
C’hanno aperto un po’ ‘l culetto`,
  dottori: `Osteria dei dottori
Hanno tutti il cazzo fuori
E lo danno alle colleghe
Per non farsi delle seghe`,
  n: `Osteria numero enne
il mio cazzo ha le antenne
quando inculo il sacrestano
sento radio Vaticano`,
  vaticano: `Osteria del Vaticano
è successo un fatto strano
Sua Eminenza con gli occhiali
s'inculava i cardinali`,
  vaticanoa: `Osteria del Vaticano
pure il papa ha il cazzo in mano
va gridando "Porco Dio,
voglio fica pure io...`,
  vaticanob: `Osteria del Vaticano
è successo un fatto strano
una guardia papalina
si inculava una gallina.`,
  vaticanoc: `Osteria del Vaticano
esce il papa col cazzo in mano
gridando porco Dio
le puttane le voglio anch'io`,
  antinferno: `Osteria dell'Antinferno
s'è incazzato il Padreterno
perché il suo divin figliolo
è tornato con lo scolo`,
  gallodoro: `Osteria del gallo d'oro
il più stronzo è chi fa il coro
ma il più stronzo della lista
è colui che fa il solista`,
  paradiso: `Osteria del Paradiso
c'era Dante con sorriso
Beatrice, la sua donna,
gli è tornata senza gonna`,
  paradisoa: `Osteria del Paradiso
è successo un fatto inviso
Gesù cristo coi cerchietti
inculava gli angioletti`,
  spera: `Osteria dove si spera
anche Petrarca aspetta e spera
donna Laura, sua moglie
gli è tornata con le doglie`,
  stratosfera: `Osteria della stratosfera
si è scoperto cosa c'era
nello Sputnik la cagnetta
si sparava una pugnetta`,
  invertito: `Osteria dell'invertito
qui non metto proprio il dito
non vorrei che il suo strumento
mi mirasse proprio al centro`,
  mignotta: `Osteria della mignotta
non vogliamo una bigotta
la vogliamo emancipata
e per giunta già sbiottata`,
  minerva: `Osteria della Minerva
tutta casta si conserva
ma con il giallo, il blu e il rosso
fan casino a più non posso`,
  vescovado: `Osteria del vescovado
là di certo non ci vado
non è posto da goliarda
perché manca la bernarda`,
  pollofritto: `Osteria del pollo fritto
è uno stronzo chi sta zitto
e cantando tutti quanti
noi guardiamo sempre avanti`,
  cimitero: `Osteria del cimitero
è successo un fatto vero
due cadaveri putrefatti
si inculavano come matti`,
};

const osterieList =
  (bot: TelegramBot) =>
  (msg: TelegramBot.Message): void => {
    bot.sendMessage(msg.chat.id, Object.keys(songs).join(", "));
  };

const osteria =
  (bot: TelegramBot) =>
  (msg: TelegramBot.Message, match: RegExpMatchArray): void => {
    const song = songs[+match[1]];
    if (song === undefined) {
      bot.sendMessage(
        msg.chat.id,
        "Questa osteria non esiste, prova con un'altra"
      );
    } else {
      bot.sendMessage(
        msg.chat.id,
        `${song}\nDammela a me biondina\nDammela a me bionda`
      );
    }
  };

export default { list: osterieList, detail: osteria };
