# Changelog

All notable changes to this project will be documented in this file. This
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.1] - 2023-06-10

- Removed `ioredis` from dependencies. It was only used by the migration script
  to transfer data from Redis to SQLite. If you need to migrate from v2 to v3
  check out the instructions below.

## [3.0.0] - 2023-06-10

### BREAKING CHANGES

- this bot is now written for the [bun](https://bun.sh) runtime and it is not
  compatible with node anymore

- all features that relied on Redis to store data have been migrated to use
  SQLite. A migration script is provided and it can be run with
  `bun src/scripts/redis_to_sqlite.ts`. It will transfer all data from Redis to
  a SQLite database.
  - First, `git checkout v3.0.0` as the Redis client library and the migration
    script are only available in this version.
  - `REDIS_PORT` can be set if your Redis instance is not listening on
    port 6379.
  - `DATABASE_PATH` can be set to change the location of the SQLite database, it
    defaults to `bot.sqlite` in the current directory.
  - The functionality provided by Redisearch to perform full text searches on
    quotes is now provided by the fts5 SQLite extension
    (<https://www.sqlite.org/fts5.html>). Since not all SQLite installations
    include the extension, it is possible to load it dynamically at runtime by
    providing the path to the extension in the `SQLITE_EXTENSIONS` environment
    variable. Example: `SQLITE_EXTENSIONS=/path/to/fts5.so`

## [2.2.0] - 2022-03-01

### Added

- added plugin to count and store a user's bestemmie
- added command to get football competition codes
- _(football data)_ allow users to fetch matches and standings from all
  competitions included in free tier

### Build

- added build:dev script

### Fixed

- improved regex for user's displeasure
- _(football data)_ if no team name override exists use given team name, list
  refs and dates
- _(football data)_ only show competitions included in free tier
- _(football data)_ improved right padding when printing standings
- _(bestemmie)_ improved regex to detect bestemmie
- _(bestemmie)_ the regex needs to match the whole message

## [2.1.1] - 2021-11-15

### Fixed

- improved regex for user's displeasure

## [2.1.0] - 2021-11-15

### Added

- added plugins to measure pleasures and displeasures

## [2.0.2] - 2021-10-14

### Build

- use node 16 to build

### Fixed

- wikiquote function did not exist
- markov reply needs two words
- would run !i twice on reply to messages
- couldn’t set gifs anymore because of conflict with gotw count
- spongebob plugin wouldn’t work for uppercase text
- would only return a subset of users/quotes
- stats wouldn't return all users in a chat
- _(giphy)_ if no mp4 exists on original image, send gif
