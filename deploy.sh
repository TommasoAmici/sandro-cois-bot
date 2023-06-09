#!/bin/sh
set -e

if ! type git >/dev/null; then
  printf "git is not installed.\n"
  exit 1
fi

if ! type bun >/dev/null; then
  printf "bun is not installed.\n"
  exit 2
fi

if [ ! -d "/apps/sandro-cois/source" ]; then
  printf "Cloning repository...\n"
  git clone https://github.com/TommasoAmici/sandro-cois-bot.git /apps/sandro-cois/source
fi

cd /apps/sandro-cois/source
git checkout main
git pull

bun install --production --ignore-scripts

sudo /usr/bin/systemctl restart sandro-cois.service
