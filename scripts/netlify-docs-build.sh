#!/usr/bin/env bash
set -euo pipefail

# Build workspace packages required by the docs site (no vp task runner wrapper).
pnpm --filter @var-ui/core --filter @var-ui/react --filter @var-ui/icons run build

# Run Astro in a subshell so we can reap lingering bundler workers after it exits.
# Netlify waits for every child process; Vite/Rolldown can stay alive after "[build] Complete!".
(
  set -euo pipefail
  pnpm --filter @var-ui/docs exec astro build
) &
build_pid=$!
wait "$build_pid"
status=$?

# Reap any child processes still running under this script.
for _ in 1 2 3 4 5; do
  if ! pgrep -P "$$" >/dev/null 2>&1; then
    break
  fi
  pkill -TERM -P "$$" 2>/dev/null || true
  sleep 0.5
done
pkill -KILL -P "$$" 2>/dev/null || true

exit "$status"
