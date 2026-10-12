# Baseline verification — 12 October 2026

Executed locally with Node.js 24.18.0 and npm 11.16.0:

- `npm install`: success, lockfile generated; audit reported 0 vulnerabilities at this time.
- `npm run typecheck`: all 3 workspaces pass.
- `npm test`: 3 bid-policy tests pass (first/subsequent minimum, self-bid/deadline, late-bid extension).
- `npm run build`: contracts/API compile and web production bundle succeeds.
- API smoke: `/api/v1/health/live` returns 200; `/api/v1/health/ready` returns 503 when no database is available.
- `git diff --check`: no whitespace errors.

Docker CLI is installed but the Docker Desktop Linux engine was not running. PostgreSQL migrations, seed data, readiness with a live DB and concurrency integration tests have **not** been executed. Authentication, auction CRUD, transactional bid service, auction rooms/events, scheduler, production deployment and E2E are future tasks, not validated working features.

Run the README setup and the future acceptance suite before treating the application as complete. This verification describes the development foundation, not a finished auction application.
