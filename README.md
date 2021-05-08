![CI/CD](https://github.com/TommasoAmici/sandro-cois-bot/workflows/CI/CD/badge.svg)

## Sandro Cois bot

A multipurpose Telegram bot that can be expanded with plugins.

### Available plugins

All commands respond to both ! and /, and they are case insensitive. All entries in the database are separated by chat id.

- `/i` to search Google images. Reply to a message to use its text as query.
- `/gif` to search Giphy.
- `/quote [match]` to receive a [matching] quote
- `/addquote` to add a quote. Reply to a message to add as a quote.
- `/addquotedate` to add a quote with current date. Reply to a message to add as a quote.
- `/unquote` in reply to a quote to remove from database.
- `/magic8ball` Magic 8 ball
- `/set [key] [value]` to set a text value. The bot will respond with `value` whenever a messages starts with `key`.
- `/unset [key]` to remove from database.
- `/setlist` returns list of all sets.
- `/setgif [key]` in response to a gif/video to save in database. Will return media when the message contains `key.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)`.
- `/unsetgif [key]` to remove from database.
- `/giflist` returns list of all gifs/videos in database.
- `/setstk [key]` in response to a sticker to save in database. Will return media when the message contains `key.stk`.
- `/unsetstk [key]` to remove from database.
- `/stklist` returns list of all stickers in database.
- `/setpic [key]` in response to a picture to save in database. Will return media when the message contains `key.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)`.
- `/unsetpic [key]` to remove from database.
- `/piclist` returns list of all photos in database.
- `/spongebob` to sPOngEBboBiFy a sentence
- `/weather` through Open weather API
- `/nsfw` to clear the chat.
- `/[x]gago` to generate [x] emojis.
- `/roll [x]d[x]` roll dice.
- `/r/subreddit_name [hot|new|controversial|gilded|top|rising]` returns a random post from the subreddit. Supports sorting.
- `/stats` returns stats for chat.
- `/attivatelegrampremium` kicks user.
- `/loc [name]` returns location of [name].
- `/pokedex [name|id]` returns pokedex entry.
- `[what|cosa|cos|wat]` in response to a message makes it louder.
- `/domani` returns next Serie A matchday.
- `/classifica` returns Serie A standings.
- `/gaelico [x]` translates into Gaelic.
- `/tedesco [x]` translates into German.
- `/francese [x]` translates into French.
- `/olandese [x]` translates into Dutch.
- `/inglese [x]` translates into English.
- `/spagnolo [x]` translates into Spanish.
- `/napoletano [x]` translates into Neapolitan.
- `/settitle [x]` changes chat title to [x].

### TODO

- Markov plugin
