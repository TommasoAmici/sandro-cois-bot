## Sandro Cois bot

A multipurpose Telegram bot that can be expanded with plugins.

## Running the bot

First, you'll want to configure a few environment variables. `bun` automatically
loads them from a `.env` file in the current directory, so you can create one to
include the following variables:

- `TELEGRAM_TOKEN`: _required_ to run the bot. You can get one from
  [`@botfather`](https://t.me/botfather).
- `OPENWEATHER_TOKEN`: _optional_ to enable the `/weather` command. You can get
  one from [openweathermap.org](https://openweathermap.org/api)
- `GIPHY_TOKEN`: _optional_ to enable the `/gif` command. You can get one from
  [giphy.com](https://developers.giphy.com)
- `MAPBOX_TOKEN`: _optional_ to enable the `/loc` command. You can get one from
  [mapbox.com](https://www.mapbox.com/developers/)
- `FOOTBALLDATA_TOKEN`: _optional_ to enable commands to lookup football
  information. You can get one from
  [football-data.org](https://docs.football-data.org/general/v4/index.html)

Once you have the environment variables set up, you can run the bot with:

```sh
bun install --production --ignore-scripts
bun src/index.ts
```

### Available plugins

All commands respond to both ! and /, and they are case insensitive. All entries
in the database are separated by chat id.

- `/i` to search Google images. Reply to a message to use its text as query.
- `/gif` to search Giphy.
- `/quote [match]` to receive a [matching] quote
- `/addquote` to add a quote. Reply to a message to add as a quote.
- `/addquotedate` to add a quote with current date. Reply to a message to add as
  a quote.
- `/unquote` in reply to a quote to remove from database.
- `/magic8ball` Magic 8 ball
- `/set [key] [value]` to set a text value. The bot will respond with `value`
  whenever a messages starts with `key`.
- `/unset [key]` to remove from database.
- `/setlist` returns list of all sets.
- `/setgif [key]` in response to a gif/video to save in database. Will return
  media when the message contains
  `key.(gif|webm|mp4|gifv|mkv|avi|divx|m4v|mov)`.
- `/unsetgif [key]` to remove from database.
- `/giflist` returns list of all gifs/videos in database.
- `/setstk [key]` in response to a sticker to save in database. Will return
  media when the message contains `key.stk`.
- `/unsetstk [key]` to remove from database.
- `/stklist` returns list of all stickers in database.
- `/setpic [key]` in response to a picture to save in database. Will return
  media when the message contains `key.(png|jpg|jpeg|tiff|bmp|pic|psd|svg)`.
- `/unsetpic [key]` to remove from database.
- `/piclist` returns list of all photos in database.
- `/spongebob` to sPOngEBboBiFy a sentence
- `/weather` through Open weather API
- `/nsfw` to clear the chat.
- `/[x]gago` to generate [x] emojis.
- `/roll [x]d[x]` roll dice.
- `/r/subreddit_name [hot|new|controversial|gilded|top|rising]` returns a random
  post from the subreddit. Supports sorting.
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

#### `/stickerify`

The `/stickerify` command can segment images and automatically create stickers.
It requires a running service to segment images. I wrote a very
[simple one in Python](https://github.com/TommasoAmici/http-segmentation),
but the API is simple enough that you can write your own if you want.

You'll need to set the following environment variables:

- `HTTP_SEGMENTATION_URL`: the URL of the segmentation service
- `HTTP_SEGMENTATION_AUTH`: the value of the `Authorization` header to send to
  the segmentation service, it currently only supports basic auth and it does not
  require setting the `Basic` prefix
