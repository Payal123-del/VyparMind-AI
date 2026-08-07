#!/bin/bash

set -e

# Verify required tools
if ! command -v uv >/dev/null 2>&1; then
  echo "Error: uv is not installed. Please install uv (https://docs.astral.sh/uv/)."
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm is not installed. Please install pnpm (https://pnpm.io/installation)."
  exit 1
fi

# Auto-install dependencies if missing
if [ ! -d "backend/.venv" ]; then
  echo "Setting up Python virtual environment in backend..."
  (cd backend && uv sync)
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend node dependencies..."
  (cd frontend && pnpm install)
fi

# Start LiveKit server if available locally and not using LiveKit Cloud
if command -v livekit-server >/dev/null 2>&1; then
  livekit-server --dev &
else
  echo "Warning: livekit-server not found. Skipping local LiveKit startup and using your configured LIVEKIT_URL instead."
fi

(cd backend && uv run python src/agent.py dev) &
(cd frontend && pnpm dev) &

# Wait for all background jobs
wait
