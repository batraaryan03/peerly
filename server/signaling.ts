import { PeerServer } from 'peer';

const PORT = parseInt(process.env.SIGNALING_PORT || '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const server = PeerServer({
  port: PORT,
  path: '/peerjs',
  allow_discovery: false,   // scoped via app API, not unrestricted
  proxied: false,
  corsOptions: { origin: CORS_ORIGIN },
});

server.on('connection', (client) => {
  console.log(`[PeerJS] Client connected: ${client.getId()}`);
});

server.on('disconnect', (client) => {
  console.log(`[PeerJS] Client disconnected: ${client.getId()}`);
});

server.on('error', (err: Error & { code?: string }) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[PeerJS] FATAL: Port ${PORT} is already in use. Exiting.`);
    process.exit(1);
  }
  console.error('[PeerJS] Error:', err);
});

const shutdown = () => {
  console.log('[PeerJS] Shutting down gracefully...');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(`[PeerJS] Signaling server running on port ${PORT} (path: /peerjs)`);
