FROM oven/bun:canary

WORKDIR /opt/sandro-cois-bot/

COPY . ./

RUN bun install --production --ignore-scripts

CMD ["bun", "src/index.ts"]
