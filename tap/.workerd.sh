#!/bin/bash

. ./tap/.server.sh

COMPATIBILITY_DATE=$(NODE_PATH=$(npm root -g) node -p "require('workerd').compatibilityDate")
WORKERD_VERSION=$(npm ls --global --json | jq -r '.dependencies.workerd.version')

echo "Using workerd $WORKERD_VERSION, compatibility date $COMPATIBILITY_DATE"

./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --minify-syntax \
  --target=esnext \
  --outfile=tap/run-workerd.js \
  tap/run-workerd.ts

cat <<EOT > $(pwd)/tap/.workerd.capnp
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "main", worker = .tapWorker),
    (name = "fullNetwork", network = .myNetwork),
  ],
);

const tapWorker :Workerd.Worker = (
  modules = [
    (name = "worker", esModule = embed "run-workerd.js")
  ],
  globalOutbound = "fullNetwork",
  compatibilityDate = "$COMPATIBILITY_DATE",
);

const myNetwork :Workerd.Network = (
  allow = ["public", "private"],
  deny = []
);
EOT

workerd test --verbose $(pwd)/tap/.workerd.capnp
