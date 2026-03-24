#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$ROOT_DIR/apps/web"
API_DIR="$ROOT_DIR/apps/api"
WEB_PORT=3000
API_PORT=3001

kill_port() {
  local port="$1"
  local pids

  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"

  if [[ -n "$pids" ]]; then
    echo "Killing process(es) on port $port: $pids"
    kill -9 $pids 2>/dev/null || true
  fi
}

kill_port "$WEB_PORT"
kill_port "$API_PORT"

echo "Starting API on port $API_PORT..."
pnpm --dir "$API_DIR" run start:dev &
API_PID=$!

echo "Starting Web on port $WEB_PORT..."
pnpm --dir "$WEB_DIR" run dev &
WEB_PID=$!

cleanup() {
  echo "Stopping API and Web..."
  kill "$API_PID" "$WEB_PID" 2>/dev/null || true
  wait "$API_PID" "$WEB_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

wait
