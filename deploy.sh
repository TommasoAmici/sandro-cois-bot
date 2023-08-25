#!/bin/sh
set -e

PROJECT=sandro-cois-bot
BASE_PATH="/apps/$PROJECT"
# Pull image
cd "$BASE_PATH" || exit 1
if [ -f ".env" ]; then
  . "./.env"
else
  echo "No .env file found"
  exit 1
fi

IMAGE="tommasoamici/$PROJECT:latest"

docker pull "$IMAGE"

# Stop and restart container
docker stop "$PROJECT"
docker rm "$PROJECT"

# run application
docker run --env-file "$BASE_PATH/.env" \
  -v "$BASE_PATH/data":/data \
  --restart=always -d --name "$PROJECT" \
  --log-driver journald --log-opt tag=$PROJECT "$IMAGE"
