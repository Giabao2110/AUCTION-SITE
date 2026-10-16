# BIDHUB

Real-Time Auction Platform — Web Application Development project.

## Current status

Development foundation with a **week-1 frontend prototype, not a completed auction application**. Implemented: five preview screens (discovery, detail, login, create, dashboard), responsive layout/router, labelled fixtures and UI states, Express liveness/readiness endpoints, Socket.IO transport, initial SQL migration, bid policy with unit tests, npm workspaces and CI. Real authentication, auction CRUD, transaction-based bidding, socket rooms, scheduled closing and production deployment are planned, not implemented.

Frontend-only preview: `npm ci`, then `npm run dev:web`. This preview does not require a running API/database. Open `/auctions`, `/login`, `/auctions/new` or `/dashboard`; auction cards link to detail pages. All preview data is labelled as sample data; forms do not authenticate users or save auctions.

## Team

- Lê Ngô Gia Bảo: lead, infrastructure, realtime, integration.
- Vũ Thành Đạt: backend, database, authentication and auction/bid rules.
- Phan Quang Phú: frontend, UI integration and end-to-end user flows.

## Start locally

Requires Node.js 24, npm 11 and Docker Desktop (Linux containers) or a local PostgreSQL 17 instance.

1. `npm ci`
2. Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`).
3. `docker compose -f infra/compose.yaml up -d`
4. `npm run db:migrate`
5. Terminal 1: `npm run dev:api`
6. Terminal 2: `npm run dev:web`

Open http://localhost:5173. API liveness: http://localhost:3000/api/v1/health/live. Readiness requires PostgreSQL: http://localhost:3000/api/v1/health/ready.

`infra/compose.yaml` is a **local database configuration**, not production infrastructure. Production containers must bind the API to `0.0.0.0` internally and expose it only through the reverse proxy. Do not use the example database password in production.

## Checks

`npm run typecheck` · `npm test` · `npm run build`

Frontend checks: `npm run format:check --workspace @bidhub/web` and `npm run test:preview --workspace @bidhub/web`. For browser checks on Windows with Edge installed, set `$env:PLAYWRIGHT_CHANNEL = 'msedge'` first. The preview suite uses fixtures, not a live API/database.

## Working documents

- [Architecture, database and code ownership](docs/ARCHITECTURE.md)
- [API and realtime contract](docs/API-CONTRACT.md)
- [Detailed assignments and 8-week timeline](docs/TEAM-PLAN.md)
- [Operations and demo acceptance](docs/RUNBOOK.md)

The schedule targets 6 December 2026 provisionally; confirm the course's actual deadline. Money is stored as integer VND and serialized as strings. All times are UTC in storage/API; display in Asia/Ho_Chi_Minh.
