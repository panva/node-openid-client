#!/bin/bash

. ./tap/.server.sh

echo "Using Bun `bun -v`"

bun run tap/run-bun.ts
