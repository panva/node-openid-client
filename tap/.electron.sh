#!/bin/bash

. ./tap/.server.sh

source .electron_flags.sh
electron tap/run-electron.ts
