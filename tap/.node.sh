#!/bin/bash

. ./tap/.server.sh

source .node_flags.sh
node tap/run-node.ts
