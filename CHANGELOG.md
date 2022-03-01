# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2022-03-01

### Added

- added plugin to count and store a user's bestemmie
- added command to get football competition codes
- _(football data)_ allow users to fetch matches and standings from all competitions included in free tier

### Build

- added build:dev script

### Fixed

- improved regex for user's displeasure
- _(footballData)_ if no team name override exists use given team name, list refs and dates
- _(footballData)_ if no team name override exists use given team name, list refs and dates
- _(deps)_ update dependency ioredis to v4.28.1
- _(bestemmie)_ improved regex to detect bestemmie
- regex are stateful
- _(bestemmie)_ the regex needs to match the whole message
- _(deps)_ update dependency ioredis to v4.28.2
- _(deps)_ update dependency node-telegram-bot-api to v0.55.0
- _(deps)_ update dependency node-telegram-bot-api to v0.56.0
- _(deps)_ update dependency fuse.js to v6.5.0
- _(deps)_ update dependency mathjs to v10.0.1
- _(deps)_ update dependency fuse.js to v6.5.2
- _(deps)_ update dependency fuse.js to v6.5.3
- _(deps)_ update dependency node-html-parser to v5.2.0
- _(deps)_ update dependency mathjs to v10.0.2
- _(deps)_ update dependency ioredis to v4.28.3
- _(deps)_ update dependency mathjs to v10.1.0
- _(deps)_ update dependency axios to v0.25.0
- _(deps)_ update dependency mathjs to v10.1.1
- _(deps)_ update dependency ioredis to v4.28.4
- _(deps)_ update dependency ioredis to v4.28.5
- _(deps)_ update dependency axios to v0.26.0
- _(deps)_ update dependency @vitalets/google-translate-api to v8
- _(deps)_ update dependency mathjs to v10.2.0
- only show competitions included in free tier
- _(football data)_ improved right padding when printing standings

## [2.1.1] - 2021-11-15

### Fixed

- _(deps)_ downgraded lint-staged to v11
- improved regex for user's displeasure

## [2.1.0] - 2021-11-15

### Added

- added plugins to measure pleasures and displeasures

### Fixed

- _(deps)_ update dependency axios to v0.24.0
- _(deps)_ update dependency node-html-parser to v5.1.0
- _(deps)_ update dependency mathjs to v9.5.2
- _(deps)_ update dependency mathjs to v10

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
- _(deps)_ removed unused redis
- stats wouldn't return all users in a chat
- _(deps)_ update dependency node-html-parser to v4.1.5
- _(deps)_ update dependency mathjs to v9.5.0
- _(deps)_ update dependency ioredis to v4.27.10
- _(deps)_ update dependency node-html-parser to v5
- _(deps)_ update dependency ioredis to v4.27.11
- _(deps)_ update dependency typescript to v4.4.4
- _(deps)_ update dependency mathjs to v9.5.1
- _(deps)_ update dependency ioredis to v4.28.0
- _(deps)_ update dependency axios to v0.23.0
- added types for AxiosResponses
- _(giphy)_ if no mp4 exists on original image, send gif
