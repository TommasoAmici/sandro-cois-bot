FROM oven/bun:1.2.2

WORKDIR /opt/sandro-cois-bot/

COPY . ./

RUN bun install --production --ignore-scripts

CMD ["bun", "src/index.ts"]
