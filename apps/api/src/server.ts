import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './database/pool.js';
const server = createServer(app);
// Only transport is wired. Auction rooms/events are planned in docs/API-CONTRACT.md.
const io = new Server(server, { cors: { origin: env.webOrigin } });
server.listen(env.port, '127.0.0.1', () => console.log(`BIDHUB API: http://localhost:${env.port}`));
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  const deadline = setTimeout(() => process.exit(1), 10000);
  deadline.unref();
  io.close();
  server.close(async () => { await pool.end(); clearTimeout(deadline); });
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
