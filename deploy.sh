#!/usr/bin/env bash
#
# Deploys origin/master to poker.datala.nl:
#
#   ./deploy.sh
#
# CI builds and pushes ghcr.io/jieter/planning-poker:latest for every push to master. This waits for the CI run of
# origin/master to succeed, then pulls the image and restarts the stack on the server, in /srv/poker. That directory
# (compose.yml and .env) is managed in the datala repo, see compose/poker/README.md there. Set DEPLOY_HOST to deploy
# to another server.
set -euo pipefail
cd "$(dirname "$0")"

DEPLOY_HOST="${DEPLOY_HOST:-deployer@poker.datala.nl}"
URL=https://poker.datala.nl

say() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }
die() { printf '\033[1;31merror:\033[0m %s\n' "$1" >&2; exit 1; }

command -v gh >/dev/null || die "the GitHub CLI (gh) is needed to wait for CI"

git fetch -q origin master
SHA="$(git rev-parse origin/master)"
[[ "$(git rev-parse HEAD)" == "$SHA" ]] || echo "note: HEAD is not origin/master, deploying origin/master (${SHA:0:7})"

# The run can take a moment to show up right after a push.
say "Waiting for CI to build ${SHA:0:7}"
run_id=""
for _ in $(seq 1 15); do
    run_id="$(gh run list --workflow ci.yml --commit "$SHA" --limit 1 --json databaseId --jq '.[0].databaseId // empty')"
    [[ -n $run_id ]] && break
    sleep 2
done
[[ -n $run_id ]] || die "no CI run found for ${SHA:0:7}, is it pushed?"
gh run watch "$run_id" --exit-status || die "CI failed for ${SHA:0:7}, not deploying (gh run view $run_id)"

say "Deploying to $DEPLOY_HOST"
ssh "$DEPLOY_HOST" 'cd /srv/poker && [ -f compose.yml ] && docker compose pull && docker compose up -d' \
    || die "deploy failed; /srv/poker/compose.yml must exist on $DEPLOY_HOST, see compose/poker in the datala repo"

# A static file, as requesting / would create a poker session. Caddy holds requests for up to 15 s while the container
# restarts (lb_try_duration), so allow longer than that.
say "Checking $URL"
for _ in $(seq 1 3); do
    if curl -fsS -o /dev/null --max-time 20 "$URL/static/opengraph.png"; then
        say "Deployed https://github.com/jieter/planning-poker/commit/$SHA"
        exit 0
    fi
    sleep 2
done
die "$URL is not answering, check: ssh $DEPLOY_HOST 'cd /srv/poker && docker compose logs web'"
