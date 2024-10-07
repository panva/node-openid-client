#!/bin/bash

. ./tap/.server.sh

echo "Using edge-runtime $(cat package-lock.json | jq -r '.packages["node_modules/edge-runtime"].version')"

./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --minify-syntax \
  --target=esnext \
  --outfile=tap/run-edge-runtime.js \
  tap/run-edge-runtime.ts

node tap/.edge-runtime.mjs
