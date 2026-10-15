#!/bin/sh
set -eu
input=${1:?Usage: restore-test.sh /path/backup.dump}
[ -s "$input" ] || { echo 'Archive missing or empty' >&2; exit 1; }
# New database each time; never overwrites the application database.
target="bidhub_restore_$(date +%s)"
docker compose -f infra/compose.app.yaml exec -T db createdb -U bidhub "$target"
docker compose -f infra/compose.app.yaml exec -T db pg_restore -U bidhub -d "$target" --no-owner --exit-on-error < "$input"
docker compose -f infra/compose.app.yaml exec -T db psql -U bidhub -d "$target" -v ON_ERROR_STOP=1 -c 'SELECT (SELECT count(*) FROM users) AS users, (SELECT count(*) FROM auctions) AS auctions, (SELECT count(*) FROM bids) AS bids, (SELECT count(*) FROM auction_results) AS results;'
echo "Restore completed in separate database: $target (inspect, then remove manually)"
