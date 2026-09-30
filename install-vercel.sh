#!/bin/sh
set -e
REPO=$(git rev-parse --show-toplevel)
npm install --omit=dev --prefix "$REPO/backend"

if [ -f vite.config.js ]; then
  rm -rf _backend
  cp -a "$REPO/backend" _backend
  rm -rf _backend/node_modules
  npm install --omit=dev --prefix _backend
  npm install
else
  npm install --prefix "$REPO/frontend"
fi
