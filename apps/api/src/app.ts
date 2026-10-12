import { randomUUID } from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { pool } from './database/pool.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.webOrigin }));
app.use(express.json({ limit: '64kb' }));
app.use((_req, res, next) => { res.locals.requestId = randomUUID(); res.setHeader('X-Request-Id', res.locals.requestId); next(); });
app.get('/api/v1/health/live', (_req, res) => res.json({ status: 'ok', service: 'bidhub-api' }));
app.get('/api/v1/health/ready', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ready' }); }
  catch { res.status(503).json({ status: 'not_ready' }); }
});
app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found', requestId: res.locals.requestId } }));
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const badJson = err instanceof SyntaxError && 'status' in err && err.status === 400;
  res.status(badJson ? 400 : 500).json({ error: { code: badJson ? 'INVALID_JSON' : 'INTERNAL_ERROR', message: badJson ? 'Invalid JSON body' : 'Unexpected server error', requestId: res.locals.requestId ?? randomUUID() } });
});
