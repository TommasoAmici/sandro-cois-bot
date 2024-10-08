FROM oven/bun:1.1.29

WORKDIR /opt/sandro-cois-bot/

COPY . ./

RUN bun install --production --ignore-scripts

CMD ["bun", "src/index.ts"]
